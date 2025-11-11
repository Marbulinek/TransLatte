#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { Translator } from './translator';
import { TranslatteConfig } from './types';

const program = new Command();

program
  .name('translatte')
  .description('TransLatté - Automatic translation file generator for Angular ngx-translate')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate translation files from source file')
  .option('-c, --config <path>', 'Path to configuration file', 'translatte.config.json')
  .option('-s, --source <language>', 'Source language code (e.g., en)')
  .option('-t, --targets <languages>', 'Target language codes, comma-separated (e.g., es,fr,de)')
  .option('-i, --input <path>', 'Input source file path')
  .option('-o, --output <path>', 'Output directory path')
  .action(async (options) => {
    const spinner = ora('Loading configuration...').start();

    try {
      // Load configuration
      let config: TranslatteConfig;

      const configPath = path.resolve(options.config);
      if (fs.existsSync(configPath)) {
        spinner.text = 'Reading configuration file...';
        const configContent = fs.readFileSync(configPath, 'utf-8');
        config = JSON.parse(configContent);
      } else if (options.source && options.targets && options.input && options.output) {
        // Use command-line arguments
        config = {
          sourceLanguage: options.source,
          targetLanguages: options.targets.split(',').map((lang: string) => lang.trim()),
          inputFile: options.input,
          outputDir: options.output
        };
      } else {
        spinner.fail('Configuration file not found and required options not provided');
        console.log(chalk.yellow('\nPlease either:'));
        console.log(chalk.yellow('1. Create a translatte.config.json file, or'));
        console.log(chalk.yellow('2. Provide all required options: --source, --targets, --input, --output\n'));
        process.exit(1);
      }

      // Validate configuration
      if (!config.sourceLanguage || !config.targetLanguages) {
        spinner.fail('Invalid configuration: sourceLanguage and targetLanguages are required');
        process.exit(1);
      }

      // Check if we have either single source or multiple sources
      const hasSingleSource = config.inputFile && config.outputDir;
      const hasMultipleSources = config.sources && config.sources.length > 0;

      if (!hasSingleSource && !hasMultipleSources) {
        spinner.fail('Invalid configuration: provide either inputFile/outputDir or sources array');
        process.exit(1);
      }

      spinner.succeed('Configuration loaded');

      // Display configuration
      console.log(chalk.cyan('\n📋 Configuration:'));
      console.log(chalk.gray(`   Source Language: ${config.sourceLanguage}`));
      console.log(chalk.gray(`   Target Languages: ${config.targetLanguages.join(', ')}`));
      
      if (hasMultipleSources) {
        console.log(chalk.gray(`   Translation Sources: ${config.sources!.length}`));
        config.sources!.forEach((source, index) => {
          const name = source.name || `Source ${index + 1}`;
          console.log(chalk.gray(`     ${index + 1}. ${name}`));
          console.log(chalk.gray(`        Input: ${source.inputFile}`));
          console.log(chalk.gray(`        Output: ${source.outputDir}`));
        });
      } else {
        console.log(chalk.gray(`   Input File: ${config.inputFile}`));
        console.log(chalk.gray(`   Output Directory: ${config.outputDir}`));
      }
      console.log();

      // Create translator
      const translator = new Translator(config);

      // Start translation
      spinner.start('Starting translation process...');
      const summary = await translator.translateAll();

      // Display results
      console.log();
      
      // Group results by source if multiple sources
      if (hasMultipleSources) {
        const sourceNames = [...new Set(summary.results.map(r => r.sourceName))];
        
        sourceNames.forEach(sourceName => {
          const sourceResults = summary.results.filter(r => r.sourceName === sourceName);
          console.log(chalk.cyan(`\n📦 ${sourceName}:`));
          
          sourceResults.forEach(result => {
            if (result.success) {
              console.log(chalk.green(`   ✓ ${result.language}.json - Successfully translated`));
            } else {
              console.log(chalk.red(`   ✗ ${result.language}.json - Failed: ${result.error}`));
            }
          });
        });
      } else {
        summary.results.forEach(result => {
          if (result.success) {
            console.log(chalk.green(`✓ ${result.language}.json - Successfully translated`));
          } else {
            console.log(chalk.red(`✗ ${result.language}.json - Failed: ${result.error}`));
          }
        });
      }

      console.log();
      if (summary.successCount > 0) {
        const totalFiles = summary.totalSources * summary.totalLanguages;
        spinner.succeed(chalk.green(`Translation completed! ${summary.successCount}/${totalFiles} file(s) generated`));
        
        // Show cache info if enabled
        if (summary.cacheSize !== undefined && summary.cacheSize > 0) {
          console.log(chalk.gray(`💾 Cache: ${summary.cacheSize} translation(s) stored for faster future runs`));
        }
      }
      if (summary.failCount > 0) {
        spinner.warn(chalk.yellow(`${summary.failCount} translation(s) failed`));
      }

    } catch (error: any) {
      spinner.fail('Translation failed');
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Create a sample translatte.config.json file')
  .option('-m, --multiple', 'Create config with multiple sources for modular apps')
  .action((options) => {
    const configPath = path.resolve('translatte.config.json');
    
    if (fs.existsSync(configPath)) {
      console.log(chalk.yellow('⚠️  translatte.config.json already exists!'));
      return;
    }

    let sampleConfig: TranslatteConfig;

    if (options.multiple) {
      // Multi-module configuration
      sampleConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr', 'de', 'it'],
        sources: [
          {
            name: 'Core Module',
            inputFile: './src/assets/i18n/en.json',
            outputDir: './src/assets/i18n'
          },
          {
            name: 'Auth Module',
            inputFile: './src/app/auth/i18n/en.json',
            outputDir: './src/app/auth/i18n'
          },
          {
            name: 'Dashboard Module',
            inputFile: './src/app/dashboard/i18n/en.json',
            outputDir: './src/app/dashboard/i18n'
          }
        ]
      };
      console.log(chalk.green('✓ Created translatte.config.json (multi-module)'));
      console.log(chalk.gray('\nConfiguration created for multiple translation sources.'));
      console.log(chalk.gray('Edit the sources array to match your module structure.\n'));
    } else {
      // Single source configuration (default)
      sampleConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr', 'de', 'it'],
        inputFile: './src/assets/i18n/en.json',
        outputDir: './src/assets/i18n'
      };
      console.log(chalk.green('✓ Created translatte.config.json'));
      console.log(chalk.gray('\nEdit the configuration file to match your project structure.'));
      console.log(chalk.gray('For multi-module apps, use: translatte init --multiple\n'));
    }

    fs.writeFileSync(configPath, JSON.stringify(sampleConfig, null, 2), 'utf-8');
  });

program.parse();
