#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <Firebase.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (void) showAlert:(NSString *)title message:(NSString *)message {
  UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title
          message:message delegate:self cancelButtonTitle:nil
          otherButtonTitles:@"OK", nil];
  [alert show];
}

- (void) initFirebaseDev {
  NSString *filePath = [[NSBundle mainBundle] pathForResource:@"GoogleService-Info-Dev" ofType:@"plist"];
  FIROptions *firebaseOptions = [[FIROptions alloc] initWithContentsOfFile:filePath];
  [FIRApp configureWithOptions:firebaseOptions];
}

- (void) initFirebase {
  #if DEBUG
    if([FIRApp defaultApp] == nil) {
      [self initFirebaseDev];
    } else if ([[FIRApp defaultApp].options.projectID isEqual: @"fenix-bd79c"] == false) {
      [[FIRApp defaultApp] deleteApp:^(BOOL success) {
        if (success) {
          [self initFirebaseDev];
          [[FIRAuth auth] signOut:NULL];
        } else {
          [self showAlert:@"Error" message:@"Failed to delete prod firebase app"];
        }
        
      }];
    }
  #else
  if ([FIRApp defaultApp] == nil){
    [FIRApp configure];
  } else if ([[FIRApp defaultApp].options.projectID isEqual: @"fenix-prod"] == false) {
      [[FIRApp defaultApp] deleteApp:^(BOOL success) {
        if (success) {
          [FIRApp configure];
          [[FIRAuth auth] signOut:NULL];
        } else {
          [self showAlert:@"Error" message:@"Failed to delete dev firebase app"];
        }
        
      }];
    }
  #endif
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self initFirebase];
  
  #ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
  #endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Fenix"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

@end
