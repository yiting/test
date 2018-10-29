//  Created by Robin Speijer on 13/09/2018.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

@interface SCKShare (Deprecation)

/// The owner's userID. This is typically the person who uploaded it to Cloud. It is only used by the Cloud REST API.
@property (nonatomic, nullable, readonly) SCKObjectID *userID DEPRECATED_MSG_ATTRIBUTE("Use `owner` instead.");

@end
