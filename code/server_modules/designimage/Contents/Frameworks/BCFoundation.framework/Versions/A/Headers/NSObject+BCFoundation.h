//  Created by Sam Deane on 16/08/2017.
//  Copyright © 2017 Bohemian Coding. All rights reserved.
//

// Returns YES if the host system's major an minor version match \p majorVersion and \p minorVersion
BOOL BCRunningOSVersion(NSInteger majorVersion, NSInteger minorVersion);
// Returns YES if the host system's major an minor version match 10.12
BOOL BCRunningSierra(void);
// Returns YES if the host system's major an minor version match 10.11
BOOL BCRunningElCapitan(void);
// Returns YES if the host system's major an minor version match 10.10
BOOL BCRunningYosemite(void);

// Objective-C wrappers for the above functions.
@interface NSObject(NSProcessInfo)
- (BOOL)runningOSVersion_bc:(NSInteger)majorVersion minorVersion:(NSInteger)minorVersion;
- (BOOL)runningSierra_bc;
- (BOOL)runningElCapitan_bc;
- (BOOL)runningYosemite_bc;
@end

@interface NSObject(DeepCopying)
- (id)mutableCopyDeep;
@end
