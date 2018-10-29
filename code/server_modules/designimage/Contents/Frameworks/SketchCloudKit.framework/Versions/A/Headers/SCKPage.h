//  Created by Robin Speijer on 01-02-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKObject.h"

@class SCKArtboard, SCKDocument;

typedef NS_OPTIONS(NSUInteger, SCKPageAttributes) {
    SCKPageNoAttribute = 0,
    SCKPageNameAttribute = 1 << 0,
    SCKPageSlugAttribute = 1 << 1,
    SCKPageOrderAttribute = 1 << 2,
    SCKPageArtboardsAttribute = 1 << 3
};

/// A page inside a SCKDocument.
NS_SWIFT_NAME(Page)
@interface SCKPage : SCKObject

/// The document where this page is part of.
@property (nonatomic, nullable, readonly) SCKDocument *document;

/// A user readable name for the page.
@property (nonatomic, nullable, readonly) NSString *name;

/// A readable page-identifying string inside the document.
@property (nonatomic, nullable, readonly) NSString *slug;

/// An integer defining the page order inside the document.
@property (nonatomic, readonly) NSUInteger order;

/// All artboards that are part of this page.
@property (nonatomic, nonnull, readonly) NSArray<SCKArtboard *> *artboards;

@end
