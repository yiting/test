export default (code: string, appName: string = 'MyApp') => {
  return `import 'package:flutter/material.dart';
  void main() {
    runApp(${appName}());
  }
  
  class ${appName} extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
      return MaterialApp(
        home: Scaffold(
          appBar: AppBar(
            title: Text('Stack Positioned Widget'),
            backgroundColor: Colors.pink,
          ),
          body: HomeContent(),
        ),
      );
    }
  }
  
  class HomeContent extends StatelessWidget {
    ${code}
  }`;
};
