#!/bin/bash
# scripts/generate-demo-image.sh
set -e

# --------------------------------------------------
# Project paths
# --------------------------------------------------

# Resolve the project root.
# This script lives in ./scripts/
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Target directory for generated images
TARGET_DIR="$PROJECT_ROOT/src/assets/projects"

# Font stored alongside this script
FONT="$(dirname "$0")/PaperMono-Bold.ttf"


# --------------------------------------------------
# Projects
# --------------------------------------------------

projects=(
  "project-01"
  "project-02"
  "project-03"
  "project-04"
)


# --------------------------------------------------
# Gradient palettes
# --------------------------------------------------

palettes=(

  "#667eea #764ba2 #6b8dd6"
  "#f093fb #f5576c #fda085"
  "#4facfe #00f2fe #43e97b"
  "#43e97b #38f9d7 #30cfd0"
  "#fa709a #fee140 #f6d365"
  "#a18cd1 #fbc2eb #fad0c4"
  "#30cfd0 #330867 #5ee7df"
  "#ff9a9e #fecfef #f6d365"
  "#84fab0 #8fd3f4 #a6c1ee"
  "#c471f5 #fa71cd #fbc2eb"

  "#89f7fe #66a6ff #89f7fe"
  "#ff758c #ff7eb3 #ffb199"
  "#00c6ff #0072ff #00f2fe"
  "#f6d365 #fda085 #ff9a9e"
  "#96fbc4 #f9f586 #84fab0"
  "#a1c4fd #c2e9fb #89f7fe"
  "#d4fc79 #96e6a1 #84fab0"
  "#84fab0 #8fd3f4 #667eea"
  "#fbc2eb #a6c1ee #cfd9df"
  "#ffecd2 #fcb69f #ff9a9e"

  "#ff6a88 #ff99ac #ff9a9e"
  "#7f7fd5 #86a8e7 #91eae4"
  "#43cea2 #185a9d #43e97b"
  "#4568dc #b06ab3 #764ba2"
  "#614385 #516395 #667eea"
  "#355c7d #6c5b7b #c06c84"
  "#11998e #38ef7d #43e97b"
  "#ee9ca7 #ffdde1 #fbc2eb"
  "#2193b0 #6dd5ed #4facfe"
  "#cc2b5e #753a88 #764ba2"

  "#ee0979 #ff6a00 #f5576c"
  "#fc4a1a #f7b733 #fee140"
  "#f2994a #f2c94c #f6d365"
  "#eb5757 #f2c94c #fda085"
  "#ff512f #dd2476 #f5576c"
  "#ff9966 #ff5e62 #fa709a"
  "#e96443 #904e95 #c471f5"
  "#f857a6 #ff5858 #f093fb"
  "#ff416c #ff4b2b #ff758c"
  "#f12711 #f5af19 #fee140"

  "#00b09b #96c93d #43e97b"
  "#56ab2f #a8e063 #84fab0"
  "#134e5e #71b280 #38f9d7"
  "#1d976c #93f9b9 #30cfd0"
  "#11998e #38ef7d #43e97b"
  "#02aab0 #00cdac #5ee7df"
  "#16a085 #f4d03f #f6d365"
  "#2af598 #009efd #00f2fe"
  "#0ba360 #3cba92 #43e97b"
  "#43c6ac #f8ffae #96e6a1"

  "#4776e6 #8e54e9 #764ba2"
  "#8e2de2 #4a00e0 #667eea"
  "#396afc #2948ff #4facfe"
  "#5f2c82 #49a09d #30cfd0"
  "#41295a #2f0743 #330867"
  "#6441a5 #2a0845 #764ba2"
  "#5c258d #4389a2 #6b8dd6"
  "#200122 #6f0000 #c06c84"
  "#7b4397 #dc2430 #f5576c"
  "#8e44ad #3498db #a1c4fd"
)


# --------------------------------------------------
# Validation
# --------------------------------------------------

if ! command -v magick &> /dev/null; then
  echo "Error: ImageMagick is not installed."
  exit 1
fi

if [ ! -f "$FONT" ]; then
  echo "Error: Font not found:"
  echo "$FONT"
  exit 1
fi


# --------------------------------------------------
# Create target directory
# --------------------------------------------------

mkdir -p "$TARGET_DIR"


# --------------------------------------------------
# Generate images
# --------------------------------------------------

for project in "${projects[@]}"; do

  # Project output directory
  PROJECT_DIR="$TARGET_DIR/$project"

  # Remove existing project folder completely.
  # This ensures old images are replaced.
  rm -rf "$PROJECT_DIR"
  mkdir -p "$PROJECT_DIR"

  # Pick one palette for the whole project
  palette=${palettes[$RANDOM % ${#palettes[@]}]}

  # Convert palette into variables
  read -r color1 color2 color3 <<< "$palette"

  # Convert project name to a nicer display name
  project_name=$(echo "$project" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')

  echo "Generating: $project_name"
  echo "Palette: $palette"

  for i in {1..4}; do

    # 01.png, 02.png, 03.png, 04.png
    number=$(printf '%02d' "$i")

    filename="$PROJECT_DIR/$number.png"

    # Text shown on the image
    image_name="$project_name - $number"


    # --------------------------------------------------
    # Generate gradient
    # --------------------------------------------------

    case $i in

      1)
        # Color 1 -> Color 2
        magick -size 1600x1000 \
          "gradient:${color1}-${color2}" \
          "$filename"
        ;;

      2)
        # Color 2 -> Color 1
        magick -size 1600x1000 \
          "gradient:${color2}-${color1}" \
          "$filename"
        ;;

      3)
        # Color 1 -> Color 3
        magick -size 1600x1000 \
          "gradient:${color1}-${color3}" \
          "$filename"
        ;;

      4)
        # Color 2 -> Color 3
        magick -size 1600x1000 \
          "gradient:${color2}-${color3}" \
          "$filename"
        ;;

    esac


    # --------------------------------------------------
    # Add text overlay
    # --------------------------------------------------

    magick "$filename" \
      -gravity SouthWest \
      -font "$FONT" \
      -pointsize 28 \
      -fill "rgba(255,255,255,0.75)" \
      -annotate +50+45 "$image_name" \
      "$filename"


    echo "  ✓ $number.png"

  done

  echo ""

done


# --------------------------------------------------
# Done
# --------------------------------------------------

echo "Done! Images saved to:"
echo "$TARGET_DIR"