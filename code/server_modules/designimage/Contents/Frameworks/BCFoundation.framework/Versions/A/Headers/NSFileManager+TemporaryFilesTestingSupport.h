//  Created by Sam Deane on 23/3/16.
//  Copyright 2016 Bohemian Coding. All rights reserved.

#import "NSFileManager+TemporaryFiles.h"


/**
 Class extension which add support for changing the default location into which
 temporary files are placed. These are provided for testing purposes only.
 */

@interface NSFileManager (TemporaryFilesTestingSupport)

/**
 Returns the root folder in which temporary files will be created.
 
 Normally this is determined from the system by calling NSTemporaryDirectory() if no url was supplied,
 or by calling URLForDirectory:inDomain:appropriateForURL:create:error: if one was (to ensure that the
 same volume is used).

 However, to support unit testing, we allow this behaviour to be modified, and instead a fixed, 
 user-specified root to be returned, which is read from NSUserDefaults.

 This method can also be overriden by file manager subclasses, to allow injection of a different location
 without requiring the defaults system.

 This method shouldn't be called directly by production code.
 */

- (NSURL*)_temporaryFilesRootForURL:(NSURL*)url;


/**
 Set the root location in which to create all temporary files and folders.
 This location will be used by the default NSFileManager class. You can use this
 method to change the temporary file location in situations where it's not possible
 to inject a custom NSFileManager instance.

 This shouldn't be used in production code.
 */

+ (void)_setTemporaryFilesRootToURL:(NSURL*)rootURL;


@end