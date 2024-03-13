## Installing MongoDB on macOS using Homebrew

This guide provides a step-by-step process to install MongoDB on macOS using Homebrew, a popular package manager for macOS.

### Prerequisites:

- Homebrew installed on your macOS. If not, you can install it by running:

  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```

### 1. Tap the MongoDB Formulae:

To add MongoDB services to brew, tap the official formulae:

  ```bash
  brew tap mongodb/brew
  ```

### 2. Install MongoDB:

To install the MongoDB binaries, execute:

  ```bash
  brew install mongodb-community@7.0
  ```

Note: The version number `7.0` in the above command represents the MongoDB version and might change in the future. You can specify another version if required.

### 3. Start/Stop MongoDB:

With Homebrew, managing the MongoDB server is simple:

- To **start** MongoDB:

  ```bash
  brew services start mongodb/brew/mongodb-community
  ```

- To **stop** MongoDB:

  ```bash
  brew services stop mongodb/brew/mongodb-community
  ```

- To **restart** MongoDB:

  ```bash
  brew services restart mongodb/brew/mongodb-community
  ```

### 4. Connect to MongoDB:

- Once the MongoDB server is running, you can connect to it using the MongoDB shell by executing:

  ```bash
  mongosh
  ```

This will open the MongoDB shell where you can run MongoDB commands.

### 5. Uninstall MongoDB (Optional):

If you ever need to uninstall MongoDB:

  ```bash
  brew services stop mongodb/brew/mongodb-community
  brew uninstall mongodb/brew/mongodb-community
  ```

### Additional Notes:

- You can manage your MongoDB configuration, logs, and data directories. By default, MongoDB stores its data in `/usr/local/var/mongodb` and logs in `/usr/local/var/log/mongodb` when using Homebrew.

- Always refer to the official MongoDB documentation or the Homebrew package information for the most up-to-date and detailed instructions.
