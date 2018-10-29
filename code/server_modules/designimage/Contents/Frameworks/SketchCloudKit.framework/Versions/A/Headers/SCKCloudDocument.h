//  Created by Robin Speijer on 07-02-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKDocument.h"

NS_SWIFT_NAME(CloudDocument)
@interface SCKCloudDocument : SCKDocument

@property (nonatomic, nullable, readonly) NSString *slug;
@property (nonatomic, nullable, readonly) NSURL *downloadURL;
@property (nonatomic, readonly) BOOL isProcessing;
@property (nonatomic, nullable, readonly) NSURL *metaImageURL;

@end
