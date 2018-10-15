//
//  SCKLayer.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 16-08-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

#import "SCKObject.h"

@class SCKFlowConnection, SCKArtboard;

typedef NS_OPTIONS(NSUInteger, SCKLayerAttributes) {
    SCKLayerNoAttribute = 0,
    SCKLayerNameAttribute = 1 << 0,
    SCKLayerBoundingRectAttribute = 1 << 1,
    SCKLayerFlowConnectionAttribute = 1 << 2
};

@interface SCKLayer : SCKObject

@property (nonatomic, nullable, strong, readonly) NSString *name;

@property (nonatomic, assign, readonly) CGRect boundingRect;

@property (nonatomic, nullable, strong, readonly) SCKFlowConnection *flowConnection;

@property (nonatomic, nullable, readonly) SCKArtboard *artboard;

@end
