//  Created by Robin Speijer on 16-08-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKObject.h"

@class SCKLayer;

typedef NS_OPTIONS(NSUInteger, SCKFlowConnectionAttributes) {
    SCKFlowConnectionNoAttribute = 0,
    SCKFlowConnectionBackActionAttribute = 1 << 0,
    SCKFlowConnectionDestinationArtboardIDAttribute = 1 << 1,
    SCKFlowConnectionAnimationTypeAttribute = 1 << 2
};

NS_SWIFT_NAME(FlowConnection)
@interface SCKFlowConnection : SCKObject

@property (nonatomic, assign, readonly) BOOL isBackAction;

@property (nonatomic, strong, nullable, readonly) SCKObjectID *destinationArtboardID;

@property (nonatomic, strong, nullable, readonly) NSString *animationType;

@property (nonatomic, nullable, readonly) SCKLayer *layer;

@end
