//
//  SCKEnvironment.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 31-01-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

/// A predefined kind of API environment. By default, we have production, staging and test.
typedef NS_ENUM(NSInteger, SCKEnvironmentDefinition) {
  SCKEnvironmentDefinitionCustom,
  SCKEnvironmentDefinitionProduction,
  SCKEnvironmentDefinitionStaging,
  SCKEnvironmentDefinitionTest,
  SCKEnvironmentDefinitionDevelopment
};

NS_ASSUME_NONNULL_BEGIN

extern NSNotificationName const SCKEnvironmentDidChangeNotification;

/**
 A cloud environment. We currently have 3 kinds of environments: production, staging or test. The current one can be found by calling +[SCKEnvironment current]. This one can be changed by calling -[SCKEnvironment setCurrent].
 */
@interface SCKEnvironment : NSObject <NSCopying>

/// Initializes the environment from the given Cloud hostname.
- (nonnull SCKEnvironment *)initWithHost:(nullable NSString *)host;

/// Initializes the environment from a given environment name.
- (nonnull SCKEnvironment *)initWithName:(nullable NSString *)name;

/// Initializes the environment from a definition.
- (nonnull SCKEnvironment *)initWithDefinition:(SCKEnvironmentDefinition)definition;

/// The currently used Cloud environment.
+ (nonnull instancetype)current;

/// Configure the receiver as the current Cloud environment. Should only be done from the main queue.
- (void)setCurrent;

/// The represented environment by the receiver.
@property (nonatomic, readonly) SCKEnvironmentDefinition definition;

/// The public host for the receiver. Might be different from the API hosts.
@property (nonatomic, nonnull, readonly) NSString *host;

/// The environment name. An environment is identifyable by this name. However to compare environments, you should still call isEqual:.
@property (nonatomic, nonnull, readonly) NSString *name;

/// An string that describes the receiver and can be presented to the user.
@property (nonatomic, nonnull, readonly) NSString *displayName;

@end
NS_ASSUME_NONNULL_END
