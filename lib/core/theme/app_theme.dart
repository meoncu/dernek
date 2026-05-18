import 'package:flutter/material.dart';

abstract final class AppColors {
  static const deepGreen = Color(0xFF123D2A);
  static const olive = Color(0xFF6F7F3F);
  static const cream = Color(0xFFFFFDF7);
  static const gold = Color(0xFFC8A45D);
  static const success = Color(0xFF2E7D32);
  static const warning = Color(0xFFF59E0B);
  static const critical = Color(0xFFDC2626);
}

abstract final class AppTheme {
  static ThemeData light() => _theme(
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.deepGreen,
          primary: AppColors.deepGreen,
          secondary: AppColors.olive,
          tertiary: AppColors.gold,
          surface: AppColors.cream,
        ),
      );

  static ThemeData dark() => _theme(
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.deepGreen,
          brightness: Brightness.dark,
          primary: AppColors.gold,
          secondary: AppColors.olive,
        ),
      );

  static ThemeData _theme({required ColorScheme colorScheme}) {
    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: colorScheme.surface,
      cardTheme: CardThemeData(
        elevation: 0,
        margin: const EdgeInsets.all(12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide.none,
        ),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: colorScheme.primary,
        foregroundColor: colorScheme.onPrimary,
      ),
    );
  }
}
