import { AttributePlugin, RegexpGroups } from "library/src/engine";

export const HeadersPlugin: AttributePlugin = {
    pluginType: "attribute",
    prefix: "header",
    mustNotEmptyKey: true,
    mustNotEmptyExpression: true,
    preprocessors: {
        post: [
            {
                pluginType: "preprocessor",
                name: "header",
                regexp: /(?<whole>.+)/g,
                replacer: (groups: RegexpGroups) => {
                    const { whole } = groups;
                    return `'${whole}'`;
                },
            },
        ],
    },
    onLoad: (ctx) => {
        ctx.upsertIfMissingFromStore("_dsPlugins.fetch.headers", {});
        const key = ctx.key.replace(/([a-z](?=[A-Z]))/g, "$1-").toUpperCase();
        const value = ctx.expressionFn(ctx);
        ctx.store()._dsPlugins.fetch.headers[key] = value;
        return () => {
            delete ctx.store()._dsPlugins.fetch.headers[key];
        };
    },
};
