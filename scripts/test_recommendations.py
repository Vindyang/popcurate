#!/usr/bin/env python3
"""
Quick test script to verify the recommendation pipeline works.
"""

import os
import json
from pathlib import Path

def test_recommendations():
    print("=" * 60)
    print("🧪 TESTING RECOMMENDATION PIPELINE")
    print("=" * 60)

    recs_dir = Path("data/recs")

    # Check if directory exists
    if not recs_dir.exists():
        print("\n❌ Error: data/recs/ directory not found")
        print("   Run: python scripts/train_implicit_model.py")
        return False

    # Find all recommendation files
    base_files = list(recs_dir.glob("*.json"))
    base_files = [f for f in base_files if not f.name.endswith("_enhanced.json")]
    enhanced_files = list(recs_dir.glob("*_enhanced.json"))

    print(f"\n📊 Results:")
    print(f"   Base recommendations: {len(base_files)} files")
    print(f"   Enhanced recommendations: {len(enhanced_files)} files")

    if len(base_files) == 0:
        print("\n❌ No base recommendations found!")
        print("   Run: python scripts/train_implicit_model.py")
        return False

    # Test a random base recommendation file
    test_file = base_files[0]
    print(f"\n🔍 Testing file: {test_file.name}")

    try:
        with open(test_file, 'r') as f:
            data = json.load(f)

        print(f"   ✓ Valid JSON")
        print(f"   ✓ Contains {len(data)} recommendations")

        if len(data) > 0:
            sample = data[0]
            print(f"\n   Sample recommendation:")
            print(f"      Movie ID: {sample.get('itemId')}")
            print(f"      Score: {sample.get('score'):.4f}")

            if 'matched_movie' in sample:
                print(f"      Matched: {sample.get('matched_movie')}")
                print(f"   ✓ Enhanced with Gemini!")

    except json.JSONDecodeError:
        print(f"   ❌ Invalid JSON in {test_file.name}")
        return False
    except Exception as e:
        print(f"   ❌ Error reading file: {e}")
        return False

    # Summary
    print("\n" + "=" * 60)
    print("✅ PIPELINE TEST PASSED")
    print("=" * 60)

    print("\n📝 Status:")
    if len(enhanced_files) > 0:
        print(f"   ✅ {len(enhanced_files)} users have Gemini-enhanced recommendations")
        print(f"   ✅ Will show 'Because you watched...' explanations")
    else:
        print(f"   ⚠️  No Gemini enhancements yet")
        print(f"   💡 Run: python scripts/enhance_with_gemini.py")

    print("\n🚀 Next steps:")
    print("   1. Start your app: bun dev")
    print("   2. Visit: http://localhost:3000/recommendations")

    return True


if __name__ == "__main__":
    success = test_recommendations()
    exit(0 if success else 1)
