// scripts/apply_android_fixes.js
const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    console.log('Executing hook: apply_android_fixes.js');

    const platformRoot = path.join(context.opts.projectRoot, 'platforms', 'android');

    const mainGradleFile = path.join(platformRoot, 'build.gradle');
    if (fs.existsSync(mainGradleFile)) {
        let gradleContent = fs.readFileSync(mainGradleFile, 'utf8');
        if (!gradleContent.includes('cdvMinSdkVersion')) {
            console.log('Patching platforms/android/build.gradle to add cdvMinSdkVersion');
            gradleContent = 'ext.cdvMinSdkVersion = 24\n\n' + gradleContent;
            fs.writeFileSync(mainGradleFile, gradleContent, 'utf8');
        } else {
            console.log('cdvMinSdkVersion already exists in platforms/android/build.gradle');
        }
    }

    const appGradleFile = path.join(platformRoot, 'app', 'build.gradle');
    if (fs.existsSync(appGradleFile)) {
        let appGradleContent = fs.readFileSync(appGradleFile, 'utf8');
        if (!appGradleContent.includes('compileSdkVersion')) {
            console.log('Patching platforms/android/app/build.gradle to add compileSdkVersion');
            appGradleContent = appGradleContent.replace(
                /(android\s*\{)/,
                "$1\n    compileSdkVersion 34"
            );
            fs.writeFileSync(appGradleFile, appGradleContent, 'utf8');
        } else {
            console.log('compileSdkVersion already exists in platforms/android/app/build.gradle');
        }
    }
};