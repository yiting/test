//  Created by Robin Speijer on 30-01-17.
//  Copyright © 2017 Bohemian Coding. All rights reserved.

#import <Foundation/Foundation.h>

//! Project version number for SketchCloudKit.
FOUNDATION_EXPORT double SketchCloudKitVersionNumber;

//! Project version string for SketchCloudKit.
FOUNDATION_EXPORT const unsigned char SketchCloudKitVersionString[];

// API
#import <SketchCloudKit/SCKAPIEnvironment.h>
#import <SketchCloudKit/SCKAPIEnvironment+Linking.h>
#import <SketchCloudKit/SCKAPIRequest.h>
#import <SketchCloudKit/SCKAPIURLRequest.h>
#import <SketchCloudKit/SCKAuthAPIURLRequest.h>
#import <SketchCloudKit/SCKShareAPIURLRequest.h>
#import <SketchCloudKit/SCKOAuthAPIURLRequest.h>
#import <SketchCloudKit/SCKAPIProtocol.h>
#import <SketchCloudKit/SCKAPISignable.h>
#import <SketchCloudKit/NSURL+Cloud.h>
#import <SketchCloudKit/SCKOperation.h>
#import <SketchCloudKit/SCKURLOperation.h>
#import <SketchCloudKit/SCKAPIOperation.h>
#import <SketchCloudKit/SCKRestAPIOperation.h>
#import <SketchCloudKit/SCKDownloadOperation.h>
#import <SketchCloudKit/SCKOAuthAPIOperation.h>
#import <SketchCloudKit/SCKShareUploadOperation.h>
#import <SketchCloudKit/NSError+Cloud.h>
#import <SketchCloudKit/SCKAPIAuthentication.h>
#import <SketchCloudKit/SCKAPIAuthentication+Current.h>

// MODEL
#import <SketchCloudKit/SCKObject.h>
#import <SketchCloudKit/SCKUser.h>
#import <SketchCloudKit/SCKAvatar.h>
#import <SketchCloudKit/SCKShare.h>
#import <SketchCloudKit/SCKShare+Deprecation.h>
#import <SketchCloudKit/SCKShareVersion.h>
#import <SketchCloudKit/SCKDocument.h>
#import <SketchCloudKit/SCKCloudDocument.h>
#import <SketchCloudKit/SCKPage.h>
#import <SketchCloudKit/SCKArtboard.h>
#import <SketchCloudKit/SCKLayer.h>
#import <SketchCloudKit/SCKFlowConnection.h>
#import <SketchCloudKit/SCKFile.h>
#import <SketchCloudKit/SCKThumbnail.h>
#import <SketchCloudKit/SCKFileImageType.h>
#import <SketchCloudKit/SCKOrganization.h>

// DIFFING
#import <SketchCloudKit/SCKDiff.h>
#import <SketchCloudKit/SCKCollectionDiff.h>
#import <SketchCloudKit/SCKDocumentDiff.h>
#import <SketchCloudKit/SCKCloudDocumentDiff.h>
#import <SketchCloudKit/SCKPageDiff.h>
#import <SketchCloudKit/SCKArtboardDiff.h>
#import <SketchCloudKit/SCKLayerDiff.h>
#import <SketchCloudKit/SCKFlowConnectionDiff.h>
