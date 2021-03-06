// ==UserScript==
// @name         Codewars Kata Slugs
// @namespace    https://www.textninja.net
// @version      1.0.0
// @description  Show the slug for codewars challenges under the kata title
// @author       Joe Taylor
// @match        https://www.codewars.com/kata/*
// @grant        none
// ==/UserScript==

(function() {
    let cache = {};

    document.addEventListener(
        "turbolinks:load",
        (function(f) { f(); return f; }(
            function() {
                'use strict';

                if (!/^\/kata\/[0-9a-f]+(\/|$)/.test(location.pathname)) {
                    return;
                }

                let kataId = location.pathname.split("/")[2];
                let kataTitleEl = document.querySelector("h4");

                // create flexbox wrapper for kata title + slug
                let wrapper = document.createElement("div");
                Object.assign(
                    wrapper.style,
                    {
                        display: "flex",
                        flexFlow: "column nowrap",
                        lineHeight: "0.8rem",
                        margin: "0.5rem 0 0.5rem 1rem"
                    }
                );
                kataTitleEl.insertAdjacentElement("beforeBegin", wrapper);

                // wrap the kata title in a flexbox and update title CSS
                wrapper.appendChild(kataTitleEl);
                kataTitleEl.setAttribute("style", "margin: 0 !important;")

                // add slug placeholder
                let slugEl = document.createElement("div");
                slugEl.innerHTML = "&nbsp;";
                Object.assign(slugEl.style, { fontSize: "0.8rem", marginTop: "0", color: "var(--color-ui-text-lc)" });
                wrapper.appendChild(slugEl);

                // update slug
                (async function() {
                    if (cache[kataId]) {
                        slugEl.textContent = cache[kataId];
                        return;
                    }

                    let response = await fetch(`/api/v1/code-challenges/${kataId}`);
                    let result = await response.json();

                    let slug = result.slug;
                    cache[kataId] = slug;
                    slugEl.textContent = slug;

                })();
            }
        ))
    );
})();