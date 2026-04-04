#!/usr/bin/env node

/**
 * Foundation OS Global Infrastructure Validation Script
 * Validates deployment readiness and infrastructure health
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class InfrastructureValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  log(level, message, details = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, details };

    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    if (Object.keys(details).length > 0) {
      console.log('  Details:', JSON.stringify(details, null, 2));
    }

    this.results.details.push(logEntry);

    if (level === 'error') this.results.failed++;
    else if (level === 'warn') this.results.warnings++;
    else if (level === 'info') this.results.passed++;
  }

  async validateFileStructure() {
    this.log('info', 'Validating file structure...');

    const requiredFiles = [
      'vercel.global.json',
      '.github/workflows/global-production-deploy.yml',
      'monitoring/datadog-config.json',
      'cloudflare/global-config.json',
      'supabase/global-database-config.sql',
      'security/enterprise-compliance.json',
      'src/artifacts/fos-global-infrastructure.jsx'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        this.log('info', `✅ Found required file: ${file}`);
      } else {
        this.log('error', `❌ Missing required file: ${file}`);
      }
    }
  }

  async validateConfiguration() {
    this.log('info', 'Validating configuration files...');

    // Validate Vercel configuration
    try {
      const vercelConfig = JSON.parse(fs.readFileSync('vercel.global.json', 'utf8'));
      if (vercelConfig.regions && vercelConfig.regions.length >= 3) {
        this.log('info', '✅ Vercel multi-region configuration valid');
      } else {
        this.log('error', '❌ Vercel regions not properly configured');
      }
    } catch (error) {
      this.log('error', '❌ Invalid Vercel configuration', { error: error.message });
    }

    // Validate monitoring configuration
    try {
      const monitoringConfig = JSON.parse(fs.readFileSync('monitoring/datadog-config.json', 'utf8'));
      if (monitoringConfig.service === 'foundation-os') {
        this.log('info', '✅ Monitoring configuration valid');
      } else {
        this.log('error', '❌ Monitoring service name incorrect');
      }
    } catch (error) {
      this.log('error', '❌ Invalid monitoring configuration', { error: error.message });
    }
  }

  async run() {
    console.log('🌍 Foundation OS Global Infrastructure Validation Starting...\n');

    await this.validateFileStructure();
    await this.validateConfiguration();

    console.log('\n📊 VALIDATION SUMMARY');
    console.log('=====================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);

    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new InfrastructureValidator();
  validator.run().catch(console.error);
}

module.exports = InfrastructureValidator;