const fs = require('fs');
const crypto = require('crypto');

/**
 * Manages the code-lock.json file for tracking spec changes
 */
class LockManager {
  constructor(lockFilePath = './code-lock.json') {
    this.lockFilePath = lockFilePath;
    this.checksums = {};
    this.loadChecksums();
  }

  /**
   * Loads existing checksums from the lock file
   */
  loadChecksums() {
    if (fs.existsSync(this.lockFilePath)) {
      this.checksums = JSON.parse(fs.readFileSync(this.lockFilePath, 'utf8'));
    }
    return this.checksums;
  }

  /**
   * Generates a checksum for a spec
   * @param {Object} spec Specification object
   * @returns {string} MD5 hash of the spec
   */
  generateChecksum(spec) {
    return crypto
      .createHash('md5')
      .update(JSON.stringify(spec))
      .digest('hex');
  }

  /**
   * Checks if a spec has changed since last build
   * @param {Object} spec Specification object
   * @param {string} outputPath Path to the generated file
   * @returns {boolean} Whether the spec needs regeneration
   */
  hasSpecChanged(spec, outputPath) {
    const hash = this.generateChecksum(spec);
    return !this.checksums[spec.specId] || 
           this.checksums[spec.specId] !== hash || 
           !fs.existsSync(outputPath);
  }

  /**
   * Updates checksums with new values and saves to disk
   * @param {Object} newChecksums Object mapping specId to checksum
   */
  updateChecksums(newChecksums) {
    this.checksums = newChecksums;
    fs.writeFileSync(this.lockFilePath, JSON.stringify(newChecksums, null, 2));
  }
}

module.exports = LockManager;