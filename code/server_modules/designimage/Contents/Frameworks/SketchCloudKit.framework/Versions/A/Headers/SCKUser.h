//
//  SCKUser.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 30-01-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

#import "SCKObject.h"

@class SCKAvatar;

/// A user on Sketch Cloud.
@interface SCKUser : SCKObject

/// The name of the user. This includes both first and last name.
@property (nonatomic, nullable, readonly) NSString *name;

/// The validated e-mail address of the user.
@property (nonatomic, nullable, readonly) NSString *email;

/// A pending e-mail address of the user. When the user changes his e-mail address, it should still be validated. Till validated, it will be in this attribute and the old e-mail remains valid in the email attribute.
@property (nonatomic, nullable, readonly) NSString *changedEmail;

/// Whether the user has general admin rights.
@property (nonatomic, readonly) BOOL isAdmin;

/// The avatar that should represent this user.
@property (nonatomic, strong, nullable, readonly) SCKAvatar *avatar;

@end
