//  Created by Sam Deane on 23/3/16.
//  Copyright 2016 Bohemian Coding. All rights reserved.

/**
 Class extension which adds some support for generating temporary files.
 */

@interface NSFileManager (TemporaryFiles)

/**
 Returns a URL to a new, temporary folder, which will be at `<temp>/<random>`.
 Guaranteed to be a new, unique folder each time.
 */

- (NSURL*)temporaryFolderURL;

/**
 Returns a URL to a new, temporary folder, with a given name, which will be at `<temp>/<random>/<name>`.
 Guaranteed to be a new, unique folder each time.
 */

- (NSURL*)temporaryFolderURLWithName:(NSString*)name;

/**
 Returns a URL to a new, temporary file, with a given name and extension, which will be at `<temp>/<random>/<name>.extension`.
 The file isn't created, but the containing folder is, and it is guaranteed to be a new, unique folder each time (hence the overall file URL is unique).
 */

- (NSURL*)temporaryFileURLWithName:(NSString*)name extension:(NSString*)extension;

/**
 Returns a URL to a new, temporary file for use in replacing a given URL.
 If possible this new URL will be on the same volume.
 */

- (NSURL*)temporaryFileURLToReplaceURL:(NSURL*)url;

/**
 Returns a URL to a new, temporary file, with a given extension, which will be at `<temp>/<random>/temporary.extension`.
 The file isn't created, but the containing folder is, and it is guaranteed to be a new, unique folder each time.
 The file is always called "temporary", but  the overall file URL will be unique because the containing folder is.
 */

- (NSURL*)temporaryFileURLWithExtension:(NSString*)extension;

@end

