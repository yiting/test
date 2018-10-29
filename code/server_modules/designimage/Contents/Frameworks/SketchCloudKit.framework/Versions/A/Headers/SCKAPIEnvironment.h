//  Created by Robin Speijer on 31-01-17.
//  Copyright © 2017 Bohemian Coding. All rights reserved.

/// A predefined kind of API environment. By default, we have production, staging and test.
typedef NS_ENUM(NSInteger, SCKAPIEnvironmentDefinition) {
  SCKAPIEnvironmentDefinitionCustom,
  SCKAPIEnvironmentDefinitionProduction,
  SCKAPIEnvironmentDefinitionStaging,
  SCKAPIEnvironmentDefinitionTest,
  SCKAPIEnvironmentDefinitionDevelopment
} NS_SWIFT_NAME(APIEnvironment.Definition);

NS_ASSUME_NONNULL_BEGIN

extern NSString * _Nonnull const SCKAPIEnvironmentUserDefaultsKey NS_SWIFT_NAME(APIEnvironment.userDefaultsKey);
extern NSString * _Nonnull const SCKAPIEnvironmentSwitchingUserDefaultsKey NS_SWIFT_NAME(APIEnvironment.switchingUserDefaultsKey);
extern NSString * _Nonnull const SCKAPIEnvironmentProductionName NS_SWIFT_NAME(APIEnvironment.productionName);
extern NSString * _Nonnull const SCKAPIEnvironmentStagingName NS_SWIFT_NAME(APIEnvironment.stagingName);
extern NSString * _Nonnull const SCKAPIEnvironmentTestName NS_SWIFT_NAME(APIEnvironment.testName);
extern NSString * _Nonnull const SCKAPIEnvironmentDevelopmentName NS_SWIFT_NAME(APIEnvironment.developmentName);
extern NSNotificationName _Nonnull const SCKAPIEnvironmentDidChangeNotification NS_SWIFT_NAME(APIEnvironment.didChangeNotification);

/**
 A cloud environment. We currently have 3 kinds of environments: production, staging or test. The current one can be found by calling +[SCKAPIEnvironment current]. This one can be changed by calling -[SCKAPIEnvironment setCurrent].
 */
NS_SWIFT_NAME(APIEnvironment)
@interface SCKAPIEnvironment : NSObject <NSCopying>

/// Initializes the environment from the given Cloud hostname.
- (nonnull SCKAPIEnvironment *)initWithHost:(nullable NSString *)host;

/// Initializes the environment from a given environment name.
- (nonnull SCKAPIEnvironment *)initWithName:(nullable NSString *)name;

/// Initializes the environment from a definition.
- (nonnull SCKAPIEnvironment *)initWithDefinition:(SCKAPIEnvironmentDefinition)definition;

/// The currently used Cloud environment.
+ (nonnull instancetype)current;

/// Configure the receiver as the current Cloud environment. Should only be done from the main queue.
- (void)setCurrent;

/// The represented environment by the receiver.
@property (nonatomic, readonly) SCKAPIEnvironmentDefinition definition;

/// The public host for the receiver. Might be different from the API hosts.
@property (nonatomic, nonnull, readonly) NSString *host;

/// The environment name. An environment is identifyable by this name. However to compare environments, you should still call isEqual:.
@property (nonatomic, nonnull, readonly) NSString *name;

/// An string that describes the receiver and can be presented to the user.
@property (nonatomic, nonnull, readonly) NSString *displayName;

@end
NS_ASSUME_NONNULL_END
