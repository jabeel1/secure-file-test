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
  GetAuthScope,
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
    $id: "secure-files-stream-admin",
    // Specifies the exact data that each generated document will contain. This data is passed in
    // directly as props to the default exported function.
    fields: ["id", "name", "c_secureBodyField", "shortDescriptionV2", "externalAuthorizedIdentities"],
    // Defines the scope of entities that qualify for this stream.
    filter: {
      entityTypes: ["helpArticle"],
      entityIds: ["17665096328731"],
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
  return `/secure`;
};

/**
 * Defines a list of paths which will redirect to the path created by getPath.
 */
export const getRedirects: GetRedirects<TemplateProps> = ({ document }) => {
  return [];
};

export const getAuthScope: GetAuthScope<TemplateProps> = ({document}) => {
  return `(claims.email in [${document.externalAuthorizedIdentities.map((email) => `"${email}"`).join(",")}])`;
}

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
      <strong>{name}</strong><br/>
      <strong>Hello <span id="user"></span>!</strong><br/>
      <p>Below are two images, the first is an insecure link and the second is a secure link. To use this page, the logged in user must be included in the following emails set on the entity.</p><br/>
      <h4>Non-Secure Rich Text Image</h4>
      <img src={shortDescriptionV2.json?.root.children[0]?.children[0]?.src}/>
      <br/>
      <h4>Secure Rich Text Image</h4>
      <img src={c_secureBodyField.json?.root.children[0]?.children[1]?.src}/>
      <script>
        document.getElementById("user").innerHTML = YEXT_AUTH.visitor.email;
      </script>
    </>
  );
};

export default EntityPage;
