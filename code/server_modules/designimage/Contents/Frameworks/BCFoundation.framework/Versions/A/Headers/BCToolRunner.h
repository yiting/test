//
//  BCToolRunner.h
//  Sketch
//
//  Created by Markus Piipari on 09/11/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.
//

#import <Foundation/Foundation.h>


/// Instances of this class describe the result of running a tool binary.
@interface BCToolRunningResult : NSObject

@property (nonatomic, readonly) NSData *errorOutput;
@property (nonatomic, readonly) int exitStatus;
@property (nonatomic, readonly) NSData *output;
@property (nonatomic, readonly) NSTaskTerminationReason terminationReason;

- (instancetype)init NS_UNAVAILABLE;

@end


typedef void (^MSToolCompletionHandler)(BCToolRunningResult *result, NSError *error);


/// Class for running an executable binary as a subprocess.
@interface BCToolRunner: NSObject

/**
 
 Asynchronously run a tool subprocess.
 
 If an executable tool binary isn't found at `toolURL`, the completion handler will be called with a `nil`
 result object and an error describing the issue.
 
 If the tool binary is launched succesfully, the completion handler block will be called with a result object
 and a `nil` error object. The tool may, of course, still have encountered an error, which the client is to
 determine by examining the result object.
 
 */
- (void)runToolAtExecutableURL:(NSURL *)toolURL
           workingDirectoryURL:(NSURL *)workingDirectoryURL
                     arguments:(NSArray<NSString *> *)arguments
             completionHandler:(MSToolCompletionHandler)completionHandler;

@end
