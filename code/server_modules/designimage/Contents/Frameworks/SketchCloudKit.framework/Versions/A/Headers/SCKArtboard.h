//  Created by Robin Speijer on 01-02-17.
//  Copyright © 2017 Bohemian Coding. 

@import CoreGraphics.CGGeometry;

#import "SCKObject.h"
#import "SCKFileImageType.h"

@class SCKFile, SCKPage, SCKLayer;

typedef NS_OPTIONS(NSUInteger, SCKArtboardAttributes) {
    SCKArtboardNoAttribute = 0,
    SCKArtboardNameAttribute = 1 << 0,
    SCKArtboardSlugAttribute = 1 << 1,
    SCKArtboardOrderAttribute = 1 << 2,
    SCKArtboardUnreadAttribute = 1 << 3,
    SCKArtboardSizeAttribute = 1 << 4,
    SCKArtboardFilesAttribute = 1 << 5,
    SCKArtboardLayersAttribute = 1 << 6,
    SCKArtboardIsFlowHomeAttribute = 1 << 7,
    SCKArtboardViewportAttribute = 1 << 8,
    SCKArtboardPossibleFileTypesAttribute = 1 << 9
};

typedef struct SCKArtboardViewport {
    CGFloat scale;
    CGSize size;
} SCKArtboardViewport;

/// An artboard inside a SCKPage.
NS_SWIFT_NAME(Artboard)
@interface SCKArtboard : SCKObject

/// The page that this artboard is part of.
@property (nonatomic, nullable, readonly) SCKPage *page;

/// The user readable name for the artboard.
@property (nonatomic, nullable, readonly) NSString *name;

/// A uniquely artboard-identifying string within the page.
@property (nonatomic, nullable, readonly) NSString *slug;

/// An integer to define the artboard order in the document.
@property (nonatomic, readonly) NSUInteger order;

/// Whether the artboard has unread notifications. Those notifications might notify the user about unread comments.
@property (nonatomic, readonly) NSUInteger unread;

/// The artboard size in points.
@property (nonatomic, readonly) CGSize size;

/// The viewport to display the artboard in. If it is smaller than the actual artboard size, the artboard should be scrollable.
@property (nonatomic, readonly) SCKArtboardViewport viewport;

/// The possible files that represent the artboard's image. Generally, those files only differ in scales.
@property (nonatomic, nonnull, readonly) NSArray<SCKFile *> *files;

/// File types that are possible to query from the Sketch webserver. Only available when getting the manifest from Sketch itself.
@property (nonatomic, readonly) SCKFileImageType possibleFileTypes;

/// All relevant layers for this artboard, for example for wireflows. This property does not neccesarily contain all layers of the artboard.
@property (nonatomic, nullable, strong) NSArray<SCKLayer *> *layers;

/// Indicates whether the receiver is a startingpoint for a full wireflow chain.
@property (nonatomic, assign) BOOL isFlowHome;

/**
 Looks up the most suitable image file in the files attribute at the given screen scale.

 @param scale The optimal scale to use for the image file.
 @return An image file.
 */
- (nullable SCKFile *)fileAtScale:(CGFloat)scale ofType:(SCKFileImageType)type NS_SWIFT_NAME(file(atScale:type:));

@end
