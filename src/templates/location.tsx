/**
 * This is an example of how to create a template that makes use of streams data.
 * The stream data originates from Yext's Knowledge Graph. When a template in
 * concert with a stream is built by the Yext Sites system, a static html page
 * is generated for every corresponding stream document stream document (based on the filter).
 */

import {
  GetHeadConfig,
  GetPath,
  GetRedirects,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import { LexicalRichText } from "@yext/pages-components";
import * as React from "react";
import "../index.css";

/**
 * Required when Knowledge Graph Stream is used for a template.
 */
export const config: TemplateConfig = {
  stream: {
    $id: "secure-files-stream",
    // Specifies the exact data that each generated document will contain. This data is passed in
    // directly as props to the default exported function.
    fields: ["id", "name", "c_secureBodyField", "shortDescriptionV2"],
    // Defines the scope of entities that qualify for this stream.
    filter: {
      entityTypes: ["helpArticle"],
    },
    // The entity language profiles that documents will be generated for.
    localization: {
      locales: ["en"],
    },
  },
};

/**
 * Defines the path that the generated file will live at for production.
 */
export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return `/help/${document.id}`;
};

/**
 * Defines a list of paths which will redirect to the path created by getPath.
 */
export const getRedirects: GetRedirects<TemplateProps> = ({ document }) => {
  return [];
};

/**
 * This allows the user to define a function which will take in their template
 * data and produce a HeadConfig object. When the site is generated, the HeadConfig
 * will be used to generate the inner contents of the HTML document's <head> tag.
 * This can include the title, meta tags, script tags, etc.
 */
export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

/**
 * This is the main template. It can have any name as long as it's the default export.
 * The props passed in here are the direct stream document defined by `config`.
 */
const EntityPage: Template<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}) => {
  const { name, shortDescriptionV2, c_secureBodyField } = document;

  return (
    <>
      <h1>{name}</h1>
      <h4>Non-Secure Rich Text Field</h4>
      {shortDescriptionV2?.json && <LexicalRichText serializedAst={JSON.stringify(shortDescriptionV2.json)} />}
      <h4>Secure Rich Text Field</h4>
      {c_secureBodyField?.json && <LexicalRichText serializedAst={JSON.stringify(c_secureBodyField.json)} />}
    </>
  );
};

export default EntityPage;
