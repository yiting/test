//  Created by Pieter Omvlee on 3/9/08.
//  Copyright 2008 Bohemian Coding. All rights reserved.

@interface NSFileManager (BCFoundation)

/**
 * Equal to subPathsOfDirectory but leaves out the invisible files
 * @param path the directory to search
 */

- (NSArray *)visibleSubpathsOfDirectory:(NSString *)path;

/**
 * If the directory exists, this method does nothing. If it doesnt, the directory is created.
 * @param directory the directory to create
 */

- (BOOL)createDirectoryIfNecessary:(NSString *)directory;

- (BOOL)fileExistsAtURL:(NSURL *)url;


- (NSArray *)shallowSubpathsOfDirectoryAtURL:(NSURL*)url;
- (NSArray *)shallowSubpathURLsOfDirectoryAtURL:(NSURL*)url;

/**
 * Does a shallow search of a directory looking for non hidden files that have specific URL resource values. Returns the file names not paths of the files found.
 
 Example:
 [NSFileManager.defaultManager shallowFilenamesOfDirectoryAtURL:[NSURL fileURLWithPath:@"/Users/john/Pictures" isDirectory:YES]
                                          withURLResourceValues:[NSSet setWithObject:(NSString *)kUTTypeJPEG]
                                              forURLResourceKey:NSURLTypeIdentifierKey];
 */
- (NSArray <NSString *> *)shallowFilenamesOfDirectoryAtURL:(NSURL *)url withURLResourceValues:(NSSet *)urlResourceValues forURLResourceKey:(NSURLResourceKey)resourceKey;

/**
 Is there an item at the given path, and is it a folder?
 */

- (BOOL)isFolderAtPath:(NSString *)path;

/**
 Is there an item at the given URL, and is it a folder?
 */

- (BOOL)isFolderAtURL:(NSURL *)url;

/**
 Take an existing URL and return a unique version of it.
 If an item with the URL exists, a number is appended to the name to make a unique version of it.
 */

- (NSURL *)uniqueURL:(NSURL *)url;

@end
