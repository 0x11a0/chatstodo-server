To install MongoDB on Windows, you can use the MongoDB MSI package, which is an easy-to-use installer for MongoDB. Here's how you can set it up:

### 1. Download the MongoDB MSI Package:

1. Visit the MongoDB official download page: [MongoDB Download Center](https://www.mongodb.com/try/download/community).

2. Select the "Windows" tab.

3. Choose the appropriate version. By default, the latest version is selected.

4. For the "Package" option, select "MSI".

5. Click on the "Download" button and it will download an MSI installer for MongoDB.

### 2. Install MongoDB:

1. Run the downloaded MSI package.

2. Follow the installation wizard, which will guide you through the setup process.

3. During installation, you can choose the "Complete" setup type for a standard installation or "Custom" if you want to change installation directories.

4. The installer will also ask if you want to install MongoDB Compass, which is the official graphical user interface for MongoDB. You can choose to install it or skip it based on your preference.

### 3. Set Up MongoDB Environment:

1. By default, MongoDB will be installed in `C:\Program Files\MongoDB`.

2. The default data directory is `C:\data\db`. Make sure to create this directory, or MongoDB will refuse to start because the directory does not exist:

    ```sh
    mkdir C:\data\db
    ```

### 4. Start MongoDB:

1. Open the Command Prompt as Administrator.

2. Navigate to the MongoDB bin directory, e.g., `C:\Program Files\MongoDB\Server\7.0\bin`.

3. Run `mongod.exe` to start the MongoDB daemon.

### 5. Connect to MongoDB:

1. In another Command Prompt window (you don't have to run it as an administrator), navigate to the MongoDB bin directory.

2. Run `mongo.exe`. This will start the MongoDB shell, and you can run MongoDB commands here.

### 6. Set MongoDB to Start as a Service (Optional):

To make MongoDB start automatically with Windows, you can set it up as a service. This is done during the installation process by selecting the "Run service as Network Service user" or "Run service as Local or Domain User" options in the MongoDB installer.

### 7. Using `mongosh`:

If you prefer using `mongosh` (the MongoDB Shell) over the older `mongo` shell, you can install it separately. It offers a more modern interface, syntax highlighting, and other improved features.

1. Download `mongosh` from the [official download page](https://www.mongodb.com/try/download/shell).

2. Follow the installation steps.

3. Open Command Prompt and just type `mongosh` to start it.
