export function stringArrayToYAMLField(
  fieldName: string,
  fieldValues: string[],
  indentLevel = 0
) {
  const filteredValues = fieldValues.filter((v) => v !== "");

  if (filteredValues.length === 0) {
    return "";
  }

  let indent = "";
  for (let i = 0; i < indentLevel; i++) indent += "  ";
  return `\n${indent}${fieldName}:${filteredValues
    .map((value) => `\n  ${indent}- ${value}`)
    .join("")}`;
}

export type ProjectTemplateFields = {
  name: string;
  repoUrl: string;
  description: string;
  maintainer: string;
  created: string;
  languages?: string[];
  tags?: string[];
  currentlySeeking?: string[];
  websiteUrl?: string;
  twitterUrl?: string;
  avatar?: string;
  contributionOverview?: {
    mainLocation?: string;
    idealEffort?: string;
    isMentorshipAvailable?: boolean;
    automatedDevEnvironment?: string;
    extras?: string[];
  };
  featuredMap?: {
    url: string;
    description?: string;
  };
  maps?: {
    url: string;
    description?: string;
    subTitle?: string;
  }[];
  learnLinks?: { title: string; url: string }[];
  contributing?: string;
  overview?: string;
};

export async function getTemplateContent(fields: ProjectTemplateFields) {
  let filledOutTemplate = `---
name: ${fields.name}
repoUrl: ${fields.repoUrl}
description: ${fields.description}
maintainer: ${fields.maintainer}
created: ${fields.created}`;

  if (fields.languages) {
    filledOutTemplate += stringArrayToYAMLField("languages", fields.languages);
  }
  if (fields.tags) {
    filledOutTemplate += stringArrayToYAMLField("tags", fields.tags);
  }
  if (fields.currentlySeeking) {
    filledOutTemplate += stringArrayToYAMLField(
      "currentlySeeking",
      fields.currentlySeeking
    );
  }

  if (fields.websiteUrl) {
    filledOutTemplate += "\nwebsiteUrl: " + fields.websiteUrl;
  }
  if (fields.twitterUrl) {
    filledOutTemplate += "\ntwitterUrl: " + fields.twitterUrl;
  }
  if (fields.avatar) {
    filledOutTemplate += "\navatar: " + fields.avatar;
  }
  if (fields.contributionOverview) {
    let overviewString = "";

    if (fields.contributionOverview.mainLocation) {
      overviewString +=
        "\n  mainLocation: " + fields.contributionOverview.mainLocation;
    }
    if (fields.contributionOverview.idealEffort) {
      overviewString +=
        "\n  idealEffort: " + fields.contributionOverview.idealEffort;
    }
    if (fields.contributionOverview.isMentorshipAvailable) {
      overviewString +=
        "\n  isMentorshipAvailable: " +
        fields.contributionOverview.isMentorshipAvailable;
    }
    if (fields.contributionOverview.automatedDevEnvironment) {
      overviewString +=
        "\n  automatedDevEnvironment: " +
        fields.contributionOverview.automatedDevEnvironment;
    }
    if (fields.contributionOverview.extras) {
      overviewString += stringArrayToYAMLField(
        "extras",
        fields.contributionOverview.extras,
        1
      );
    }

    // Only add the top-level field if we have some nested content
    if (overviewString.length > 0) {
      filledOutTemplate += "\ncontributionOverview:";
      filledOutTemplate += overviewString;
    }
  }

  if (fields.featuredMap) {
    filledOutTemplate += "\nfeaturedMap:";
    filledOutTemplate += "\n  url: " + fields.featuredMap.url;

    if (fields.featuredMap.description) {
      filledOutTemplate += "\n  description: " + fields.featuredMap.description;
    }
  }

  if (fields.maps) {
    filledOutTemplate += "\nmaps:";
    fields.maps.forEach((map) => {
      filledOutTemplate += "\n  - url: " + map.url;

      if (map.description) {
        filledOutTemplate += "\n    description: " + map.description;
      }

      if (map.subTitle) {
        filledOutTemplate += "\n    subTitle: " + map.subTitle;
      }
    });
  }

  if (fields.learnLinks) {
    filledOutTemplate += "\nlearnLinks:";
    fields.learnLinks.forEach((link) => {
      filledOutTemplate += "\n  - title: " + link.title;
      filledOutTemplate += "\n    url: " + link.url;
    });
  }

  // Close the frontmatter section
  filledOutTemplate += "\n---\n";

  if (fields.overview) {
    filledOutTemplate += "\n<Overview>\n\n";
    filledOutTemplate += fields.overview;
    filledOutTemplate += "\n\n</Overview>\n";
  }

  if (fields.contributing) {
    filledOutTemplate += "\n<Contributing>\n\n";
    filledOutTemplate += fields.contributing;
    filledOutTemplate += "\n\n</Contributing>\n";
  }

  console.log(filledOutTemplate);

  return Buffer.from(filledOutTemplate).toString("base64");
}
