"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommand = void 0;
const renderer_1 = require("@remotion/renderer");
const studio_server_1 = require("@remotion/studio-server");
const node_child_process_1 = require("node:child_process");
const chalk_1 = require("./chalk");
const list_of_remotion_packages_1 = require("./list-of-remotion-packages");
const log_1 = require("./log");
const addCommand = async ({ remotionRoot, packageManager, packageNames, logLevel, args, }) => {
    // Validate that all package names are Remotion packages
    const invalidPackages = packageNames.filter((pkg) => !list_of_remotion_packages_1.listOfRemotionPackages.includes(pkg));
    if (invalidPackages.length > 0) {
        throw new Error(`The following packages are not Remotion packages: ${invalidPackages.join(', ')}. Must be one of the Remotion packages.`);
    }
    const { dependencies, devDependencies, optionalDependencies, peerDependencies, } = studio_server_1.StudioServerInternals.getInstalledDependencies(remotionRoot);
    // Check if packages are already installed
    const allDeps = [
        ...dependencies,
        ...devDependencies,
        ...optionalDependencies,
        ...peerDependencies,
    ];
    const alreadyInstalled = packageNames.filter((pkg) => allDeps.includes(pkg));
    const toInstall = packageNames.filter((pkg) => !allDeps.includes(pkg));
    // Log already installed packages
    for (const pkg of alreadyInstalled) {
        log_1.Log.info({ indent: false, logLevel }, `○ ${pkg} ${chalk_1.chalk.gray('(already installed)')}`);
    }
    // If nothing to install, return early
    if (toInstall.length === 0) {
        return;
    }
    // Find the version of installed Remotion packages
    const installedRemotionPackages = list_of_remotion_packages_1.listOfRemotionPackages.filter((pkg) => allDeps.includes(pkg));
    if (installedRemotionPackages.length === 0) {
        throw new Error('No Remotion packages found in your project. Install Remotion first.');
    }
    // Get the version from the first installed Remotion package
    const packageJsonPath = `${remotionRoot}/node_modules/${installedRemotionPackages[0]}/package.json`;
    let targetVersion;
    try {
        const packageJson = require(packageJsonPath);
        targetVersion = packageJson.version;
        const packageList = toInstall.length === 1
            ? toInstall[0]
            : `${toInstall.length} packages (${toInstall.join(', ')})`;
        log_1.Log.info({ indent: false, logLevel }, `Installing ${packageList}@${targetVersion} to match your other Remotion packages`);
    }
    catch (err) {
        throw new Error(`Could not determine version of installed Remotion packages: ${err.message}`);
    }
    const manager = studio_server_1.StudioServerInternals.getPackageManager(remotionRoot, packageManager, 0);
    if (manager === 'unknown') {
        throw new Error(`No lockfile was found in your project (one of ${studio_server_1.StudioServerInternals.lockFilePaths
            .map((p) => p.path)
            .join(', ')}). Install dependencies using your favorite manager!`);
    }
    const command = studio_server_1.StudioServerInternals.getInstallCommand({
        manager: manager.manager,
        packages: toInstall,
        version: targetVersion,
        additionalArgs: args,
    });
    log_1.Log.info({ indent: false, logLevel }, chalk_1.chalk.gray(`$ ${manager.manager} ${command.join(' ')}`));
    const task = (0, node_child_process_1.spawn)(manager.manager, command, {
        env: {
            ...process.env,
            ADBLOCK: '1',
            DISABLE_OPENCOLLECTIVE: '1',
        },
        stdio: renderer_1.RenderInternals.isEqualOrBelowLogLevel(logLevel, 'info')
            ? 'inherit'
            : 'ignore',
    });
    await new Promise((resolve) => {
        task.on('close', (code) => {
            if (code === 0) {
                resolve();
            }
            else if (renderer_1.RenderInternals.isEqualOrBelowLogLevel(logLevel, 'info')) {
                throw new Error(`Failed to install packages, see logs above`);
            }
            else {
                throw new Error(`Failed to install packages, run with --log=info to see logs`);
            }
        });
    });
    for (const pkg of alreadyInstalled) {
        log_1.Log.info({ indent: false, logLevel }, `○ ${pkg}@${targetVersion} ${chalk_1.chalk.gray('(already installed)')}`);
    }
    for (const pkg of toInstall) {
        log_1.Log.info({ indent: false, logLevel }, `+ ${pkg}@${targetVersion}`);
    }
};
exports.addCommand = addCommand;
