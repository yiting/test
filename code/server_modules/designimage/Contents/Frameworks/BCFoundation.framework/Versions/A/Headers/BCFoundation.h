//  Created by Pieter Omvlee on 15/01/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

@import Foundation;
@import CoreGraphics;

#import "BCAtomicCalculatedProperty.h"
#import "BCAttributedStringFunctions.h"
#import "BCBlocks.h"
#import "BCCache.h"
#import "BCConstraint.h"
#import "BCCornerGeometry.h"
#import "BCDownloadManager.h"
#import "BCFloatRange.h"
#import "BCGeometry.h"
#import "BCLineGeometry.h"
#import "BCLocalizedString.h"
#import "BCMacros.h"
#import "BCNetworkManager.h"
#import "BCObjectSorting.h"
#import "BCObjectPool.h"
#import "BCPerformanceTimer.h"
#import "BCPointGeometry.h"
#import "BCPrimitiveFunctions.h"
#import "BCPolynomialFunctions.h"
#import "BCReadWriteLock.h"
#import "BCRangeMap.h"
#import "BCRect.h"
#import "BCRectGeometry.h"
#import "BCSandboxFunctions.h"
#import "BCSingleton.h"
#import "BCTime.h"
#import "BCTypes.h"
#import "BCVectorGeometry.h"
#import "BCVersionComparison.h"

#import "CGPath+BCFoundation.h"
#import "NSArray+BCFoundation.h"
#import "NSArray+ConcurrentMap.h"
#import "NSData+AppleCompression.h"
#import "NSDate+BCFoundation.h"
#import "NSDictionary+BCFoundation.h"
#import "NSFileManager+BCFoundation.h"
#import "NSFileManager+TemporaryFiles.h"
#import "NSFileManager+TemporaryFilesTestingSupport.h" // Intended for test use only. Has to be in the umbrella header for Swift/module export to work properly.
#import "NSMapTable+BCFoundation.h"
#import "NSObject+BCFoundation.h"
#import "NSSet+BCFoundation.h"
#import "NSSortDescriptor+BCFoundation.h"
#import "NSString+BCFoundation.h"
#import "NSURL+BCFoundation.h"
#import "NSUserDefaults+BCFoundation.h"

#import "NSString+ECLogging.h"

#import "BCAssertion.h"
#import "BCDebugMacros.h"

#if TARGET_OS_IPHONE

#elif TARGET_OS_MAC

#import "BCIntPoint.h"
#import "BCIntRect.h"
#import "BCCheckerboardPattern.h"
#import "BCMachine.h"
#import "BCToolRunner.h"
#import "BCJSONEncoder.h"
#import "BCJSONFileEncoder.h"
#import "BCJSONDataEncoder.h"
#import "BCJSONStringEncoder.h"
#import "BCJSONDecoder.h"
#import "BCMachine.h"

#endif
