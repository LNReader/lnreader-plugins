// @ts-check

/* Imports */
/** @typedef {import("@libs/filterInputs").Filters} Filters */
/** @typedef {import("@typings/types").PluginList} PluginList */
/** @typedef {import("@typings/plugin").Plugin.PluginItem} PluginItem */
/** @typedef {import("@typings/plugin").Plugin.NovelItem} NovelItem */
/** @typedef {import("@typings/plugin").Plugin.SourceNovel} SourceNovel */
/** @typedef {import("@libs/filterInputs").FilterTypes} FilterTypes */
/** @typedef {import("@libs/filterInputs").FilterTypes.CheckboxGroup} CheckboxGroup */
/**
 * @template {FilterTypes} T
 * @typedef {import("@libs/filterInputs").ValueOfFilter<T>} ValueOfFilter<T> */
/**
 * @template {Filters} T
 * @typedef {import("@libs/filterInputs").FilterToValues<T>} FilterToValues<T>
 */

const state = {
    /** @type {PluginList} */
    all_plugins: {},
    /** @type {Array<PluginItem>} */
    plugin_infos: [],
    /** @type {{language: string, keyword:null|string}} */
    plugin_search: {
        language: "",
        keyword: null,
    },
    /** @type {Array<PluginItem>} */
    plugins_in_search: [],
    /** @type {PluginWrapper | undefined} */
    current_plugin: undefined,
    /** @type {FilterToValues<Filters>} */
    filterValues: {},
};

/** @type {JQuery<HTMLSelectElement>}*/
const language_selection = $("#language");
/** @type {JQuery<HTMLInputElement>} */
const plugin_search = $("#plugin");
/** @type {JQuery<HTMLDivElement>} */
const search_results = $("#search-results");

const loadPluginsIntoSearchBar = () => {
    const { language, keyword } = state.plugin_search;
    const plugins = language ? state.all_plugins[language] : state.plugin_infos;
    state.plugins_in_search = keyword
        ? plugins.filter((p) =>
              keyword.charAt(0) === "-"
                  ? !p.name
                        .toLowerCase()
                        .includes(keyword.toLowerCase().substring(1))
                  : p.name.toLowerCase().includes(keyword.toLowerCase())
          )
        : plugins;
};

fetch("/all_plugins")
    .then((res) => res.json())
    .then((/** @type {PluginList} */ all) => {
        state.all_plugins = all;
        for (let lang in all) {
            language_selection.append(`<option>${lang}</option>`);
            state.plugin_infos = state.plugin_infos.concat(all[lang]);
        }
    })
    .then((_) => {
        loadPluginsIntoSearchBar();
    });

language_selection.on("change", (e) => {
    state.plugin_search.language = e.target.value;
    loadPluginsIntoSearchBar();
});

const display_search = () => {
    search_results.hide();
    search_results.empty();
    if (!$("#turnoff-catch").length) {
        const turnoff_catch = $("<div>").attr("id", "turnoff-catch");
        $("body").append(turnoff_catch);
        turnoff_catch.on("click", () => {
            search_results.hide();
            turnoff_catch.remove();
        });
    }
    state.plugins_in_search.forEach((plugin) => {
        // search_results.append(`
        //     <div style="display: flex; align-items: center;">
        //         <button style="display: flex; align-items: center; height: 30px; flex-shrink: 0;" data-require="${plugin.requirePath}" onclick="test_plugin(this)" type="button" class="search-item btn btn-light btn-outline-primary btn-md btn-block">
        //             <img src="./icons/${plugin.icon}" style="height: 100%; object-fit: contain; margin-right: 10px;">
        //             ${plugin.lang}/${plugin.name}
        //         </button>
        //     </div>
        // `);

        /** @type {JQuery<HTMLImageElement>} */
        const img = $("<img>", { src: `./icons/${plugin.icon}` });
        img.css({
            height: "100%",
            "object-fit": "contains",
            "margin-right": "10px",
        });
        /** @type {JQuery<HTMLButtonElement>} */
        const btn = $("<button>", {
            type: "button",
            class: "search-item btn btn-light btn-outline-primary btn-md btn-block",
        });
        btn.css({
            display: "flex",
            "align-items": "center",
            height: "30px",
            "flex-shrink": 0,
        })
            .attr("data-require", `${plugin.requirePath}`)
            .on("click", (e) => {
                console.log("clicked");
                test_plugin(e.target);
            });
        /** @type {JQuery<HTMLDivElement>} */
        const div = $("<div>");
        div.css({
            display: "flex",
            "align-items": "center",
        });
        btn.append(img).append(`${plugin.lang}/${plugin.name}`);
        div.append(btn);
        search_results.append(div);
    });
    search_results.show();
};

plugin_search.on("focus", () => {
    if (!state.all_plugins) return;
    plugin_search[0].selectionStart = 0;
    plugin_search[0].selectionEnd = plugin_search[0].value.length;
    loadPluginsIntoSearchBar();
    display_search();
});

plugin_search.on("keyup", (e) => {
    state.plugin_search.keyword = e.target.value;
    loadPluginsIntoSearchBar();
    display_search();
});

$("#clear-search").on("click", (e) => {
    search_results.hide();
    plugin_search.val("");
    plugin_search.attr("data-require", "");
});

const test_plugin = (/** @type {HTMLButtonElement} */ btn) => {
    const ele = $(btn);
    const plugin_requirePath = ele.attr("data-require");
    console.log(plugin_requirePath);
    if (!plugin_requirePath) return;
    state.current_plugin = new PluginWrapper(plugin_requirePath);
    plugin_search.attr("data-require", plugin_requirePath);
    plugin_search.val(ele.text().split("/")[1]);
    $("#turnoff-catch").trigger("click");
    state.current_plugin.getfilters();
};

class PluginWrapper {
    /**
     * @param {string} requirePath
     */
    constructor(requirePath) {
        this.requirePath = requirePath;
    }

    getfilters = () => {
        // /** @type {(f:Filters[string])=>HTMLDivElement} */
        // const makeSelect = (filter) => {
        //     const container = document.createElement("div");
        //     const select = document.createElement("select");
        //     select.classList.add("select");
        //     if (filter.inputType === 2 || filter.inputType === "Checkbox") {
        //         select.setAttribute("multiple", "");
        //     } else {
        //         select.innerHTML = `<option value=""></option>`;
        //     }
        //     select.setAttribute("key", filter.key);
        //     filter.options.forEach((v) => {
        //         const option = document.createElement("option");
        //         option.setAttribute("value", v.value);
        //         option.innerText = v.label;
        //         select.append(option);
        //     });
        //     container.append(select);
        //     const label = document.createElement("label");
        //     label.classList.add("form-label");
        //     label.classList.add("select-label");
        //     label.innerText = filter.label;
        //     container.append(label);
        //     const hr = document.createElement("hr");
        //     hr.classList.add("hr");
        //     container.append(hr);
        //     return container;
        // };
        /** @param {string} f */
        const getSafeFilterID = (f) => f.replace(/\s/g, "_").toLowerCase();
        /**
         * @param {[string,Filters[string]]} flt
         * @returns {JQuery<HTMLDivElement>}
         */
        const makeFilter = (flt) => {
            /** @type {JQuery<HTMLDivElement>} */
            const retDiv = $("<div>");
            const [key, filter] = flt;
            retDiv.addClass(`${filter.type}Filter`);
            switch (filter.type) {
                case "Picker":
                    {
                        const id = `${key}_picker`;
                        // add label
                        $("<span>")
                            .addClass("filter-label")
                            .text(`${filter.label}:`)
                            .appendTo(retDiv);

                        /** @type {JQuery<HTMLSelectElement>} */
                        const select = $("<select>");
                        // add select and its attributes
                        select
                            .attr("title", `key: ${key}`)
                            .addClass("custom-select")
                            .on("change", (e) => {
                                state.filterValues[key].value =
                                    e.target.selectedOptions[0].value;
                            })
                            .appendTo(retDiv);
                        // add all the options
                        for (const option of filter.options) {
                            select.append(
                                `<option ${
                                    option.value === filter.value
                                        ? "selected"
                                        : ""
                                } value='${option.value}'>${
                                    option.label
                                }</option>`
                            );
                        }
                    }
                    break;
                case "Checkbox":
                    {
                        // add label
                        $("<span>")
                            .addClass("filter-label")
                            .text(filter.label)
                            .appendTo(retDiv);

                        // create box for checkboxes
                        const box = $("<div>")
                            .appendTo(retDiv)
                            .addClass("checkbox-groupbox");

                        // add all checkboxes
                        for (let cb of filter.options) {
                            const id = `checkbox_${key}_${getSafeFilterID(
                                cb.value
                            )}`;
                            /** @type {JQuery<HTMLInputElement>} */
                            let inp = $("<input>", { type: "checkbox" });
                            // set default value
                            inp[0].checked = filter.value.includes(cb.value);
                            // set checkbox attributes and listeners
                            inp.attr("id", id).on("change", (e) => {
                                const { checked } = e.target;
                                const fV = state.filterValues[key];
                                if (Array.isArray(fV.value)) {
                                    fV.value = checked
                                        ? [...fV.value, cb.value]
                                        : fV.value.filter(
                                              (r) => r !== cb.value
                                          );
                                }
                            });
                            // add checkbox label
                            const label = $("<label>", { for: id })
                                .text(cb.label)
                                .prepend(inp)
                                .attr("title", `${key}: ${cb.value}`);
                            $("<div>").append(label).appendTo(box);
                        }
                    }
                    break;
                case "Switch": {
                    const id = `switch_${key}`;
                    // add the checkbox
                    /** @type {JQuery<HTMLInputElement>} */
                    const checkbox = $("<input>", { type: "checkbox" });
                    checkbox.attr("id", id);
                    // set default value
                    checkbox[0].checked = filter.value;
                    // add label
                    $("<label>", { for: id })
                        .text(filter.label)
                        .append(checkbox)
                        .addClass("filter-label")
                        .appendTo(retDiv);
                    break;
                }
                case "Text":
                    {
                        const id = `text_${key}`;
                        $("<label>", { for: id })
                            .text(filter.label)
                            .addClass("filter-label")
                            .appendTo(retDiv);
                        /** @type {JQuery<HTMLInputElement>} */
                        const inp = $("<input>", { type: "text" });
                        inp.attr("id", id)
                            .on("change", (e) => {
                                const fV = state.filterValues[key];
                                if (typeof fV.value === "string") {
                                    fV.value = e.target.value;
                                }
                            })
                            .appendTo(retDiv);
                        // set default value
                        inp[0].value = filter.value;
                    }
                    break;
                case "XCheckbox":
                    {
                        // add label
                        $("<span>")
                            .addClass("filter-label")
                            .text(filter.label)
                            .appendTo(retDiv);

                        // create box for checkboxes
                        const box = $("<div>")
                            .appendTo(retDiv)
                            .addClass("xcheckbox-groupbox");

                        // add all checkboxes
                        for (let cb of filter.options) {
                            const id = `checkbox_${key}_${getSafeFilterID(
                                cb.value
                            )}`;

                            const getCurrentState = () => {
                                const fV = state.filterValues[key];
                                if (
                                    typeof fV.value === "object" &&
                                    !Array.isArray(fV.value)
                                ) {
                                    return (
                                        (fV.value.exclude?.includes(cb.value) &&
                                            "x") ||
                                        (fV.value.include?.includes(cb.value) &&
                                            "i") ||
                                        false
                                    );
                                }
                                return false;
                            };

                            // default State
                            const checkedState =
                                (filter.value.exclude?.includes(cb.value) &&
                                    "x") ||
                                (filter.value.include?.includes(cb.value) &&
                                    "i") ||
                                false;

                            /** @type {JQuery<HTMLLabelElement>} */
                            const label = $("<label>", { for: id });
                            label
                                .addClass("xcheckbox")
                                .attr("data-state", checkedState || "");
                            /** @type {JQuery<HTMLInputElement>} */
                            const xchb = $("<input>", { type: "checkbox" });
                            if (checkedState) xchb[0].checked = true;
                            xchb.attr("id", id);
                            label
                                .text(cb.label)
                                .append(xchb)
                                .append($("<span>"));
                            xchb.on("change", (e) => {
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                e.stopPropagation();
                                const fV = state.filterValues[key];
                                if (
                                    fV.value instanceof Array ||
                                    typeof fV.value !== "object"
                                )
                                    return;
                                const curState = getCurrentState();
                                console.log("Toggle state from", curState);
                                switch (curState) {
                                    case "i":
                                        if (fV.value.include)
                                            fV.value.include =
                                                fV.value.include.filter(
                                                    (f) => f !== cb.value
                                                );
                                        if (fV.value.exclude)
                                            fV.value.exclude.push(cb.value);
                                        else fV.value.exclude = [cb.value];
                                        e.target.checked = true;
                                        label[0].dataset.state = "x";
                                        break;
                                    case "x":
                                        // set to false
                                        if (fV.value.exclude)
                                            fV.value.exclude =
                                                fV.value.exclude.filter(
                                                    (f) => f !== cb.value
                                                );
                                        e.target.checked = false;
                                        label[0].dataset.state = "";
                                        break;
                                    default:
                                        // set to "e"
                                        if (!fV.value.include)
                                            fV.value.include = [cb.value];
                                        else fV.value.include.push(cb.value);
                                        e.target.checked = true;
                                        label[0].dataset.state = "i";
                                        break;
                                }
                            });
                            box.append(label);
                        }
                    }
                    break;
                default:
                    return retDiv;
            }
            return retDiv;
        };

        fetch("/filters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pluginRequirePath: this.requirePath }),
        })
            .then((res) => res.json())
            .then((/** @type {Filters}*/ filters) => {
                const filtersModal = $("#filtersModal .modal-body");
                filtersModal.html("");
                state.filterValues = {};
                for (const fKey in filters) {
                    filtersModal.append(
                        makeFilter([fKey, filters[fKey]]),
                        $("<hr>")
                    );
                    state.filterValues[fKey] = {
                        type: filters[fKey].type,
                        value: filters[fKey].value,
                    };
                }
            });
    };

    popularNovels = () => {
        /** @type {FilterToValues<Filters>} */
        const filters = { ...state.filterValues };
        $("#popularNovels .spinner-border").show();
        fetch(`/popularNovels/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pluginRequirePath: this.requirePath,
                filters: filters,
            }),
        })
            .then((res) => res.json())
            .then((/** @type {NovelItem[] | {error:string}}*/ novels) => {
                const novel_list = $("#popularNovels .novel-list");
                novel_list.html("");
                if ("error" in novels) {
                    novel_list.html(novels.error);
                } else {
                    novels.forEach((novel) => {
                        novel_list.append(`
                    <div class="novel-item">
                        <img src="${novel.cover}" alt="No cover found">
                        <div class="novel-info">
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">name</div>
                                <samp class="info-value btn-light">${novel.name?.slice(
                                    0,
                                    50
                                )}</samp>
                                <div class="info-copy btn btn-primary" data="${
                                    novel.name
                                }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">url</div>
                                <samp class="info-value btn-light">${novel.url?.slice(
                                    0,
                                    50
                                )}</samp>
                                <div class="info-copy btn btn-primary" data="${
                                    novel.url
                                }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">cover</div>
                                <samp class="info-value btn-light">${novel.cover?.slice(
                                    0,
                                    50
                                )}</samp>
                                <div class="info-copy btn btn-primary" data="${
                                    novel.cover
                                }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                        </div>
                    </div>
                    `);
                    });
                }
                $("#popularNovels .spinner-border").hide();
            });
    };

    searchNovels = () => {
        const searchTerm = $("#searchNovels input").val();
        $("#searchNovels .spinner-border").show();
        fetch(`/searchNovels/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pluginRequirePath: this.requirePath,
                searchTerm: searchTerm,
            }),
        })
            .then((res) => res.json())
            .then((/** @type {NovelItem[] | {error:string}} */ novels) => {
                const novel_list = $("#searchNovels .novel-list");
                novel_list.html("");
                if ("error" in novels) {
                    novel_list.html(novels.error);
                } else {
                    novels.forEach((novel) => {
                        novel_list.append(`
                    <div class="novel-item">
                        <img src="${novel.cover}" alt="No cover found">
                        <div class="novel-info">
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">name</div>
                                <samp class="info-value btn-light">${novel.name?.slice(
                                    0,
                                    50
                                )}</samp>
                                <div class="info-copy btn btn-primary" data="${
                                    novel.name
                                }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">url</div>
                                <samp class="info-value btn-light">${novel.url?.slice(
                                    0,
                                    50
                                )}</samp>
                                <div class="info-copy btn btn-primary" data="${
                                    novel.url
                                }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">cover</div>
                                <samp class="info-value btn-light">${novel.cover?.slice(
                                    0,
                                    50
                                )}</samp>
                                <div class="info-copy btn btn-primary" data="${
                                    novel.cover
                                }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                        </div>
                    </div>
                    `);
                    });
                }
                $("#searchNovels .spinner-border").hide();
            });
    };

    parseNovelAndChapters = () => {
        const novelUrl = $("#parseNovelAndChapters input").val();
        $("#parseNovelAndChapters .spinner-border").show();
        fetch(`/parseNovelAndChapters/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pluginRequirePath: this.requirePath,
                novelUrl: novelUrl,
            }),
        })
            .then((res) => res.json())
            .then(
                (/** @type {SourceNovel  | {error:string}} */ sourceNovel) => {
                    const novel_item = $(
                        "#parseNovelAndChapters .novel-list .novel-item"
                    );
                    if ("error" in sourceNovel) {
                        novel_item.html(sourceNovel.error);
                    } else {
                        novel_item.html(`
                <img src="${sourceNovel.cover}" alt="No cover found">
                <div class="novel-info">
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">name</div>
                        <samp class="info-value btn-light">${sourceNovel.name?.slice(
                            0,
                            50
                        )}</samp>
                        <div class="info-copy btn btn-primary" data="${
                            sourceNovel.name
                        }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">url</div>
                        <samp class="info-value btn-light">${sourceNovel.url?.slice(
                            0,
                            50
                        )}</samp>
                        <div class="info-copy btn btn-primary" data="${
                            sourceNovel.url
                        }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">cover</div>
                        <samp class="info-value btn-light">${sourceNovel.cover?.slice(
                            0,
                            50
                        )}</samp>
                        <div class="info-copy btn btn-primary" data="${
                            sourceNovel.cover
                        }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">summary</div>
                        <samp class="info-value btn-light">${sourceNovel.summary?.slice(
                            0,
                            50
                        )}</samp>
                        <div class="info-copy btn btn-primary" data="${
                            sourceNovel.summary
                        }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">author</div>
                        <samp class="info-value btn-light">${
                            sourceNovel.author
                        }</samp>
                        <div class="info-copy btn btn-primary" data="${
                            sourceNovel.author
                        }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">artist</div>
                        <samp class="info-value btn-light">${
                            sourceNovel.artist
                        }</samp>
                        <div class="info-copy btn btn-primary" data="${
                            sourceNovel.artist
                        }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">status</div>
                        <samp class="info-value btn-light">${
                            sourceNovel.status
                        }</samp>
                        <div class="info-copy btn btn-primary" data="${
                            sourceNovel.status
                        }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">genres</div>
                        <samp class="info-value btn-light">${sourceNovel.genres?.slice(
                            0,
                            50
                        )}</samp>
                        <div class="info-copy btn btn-primary" data="${
                            sourceNovel.genres
                        }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                </div>
            `);

                        const chapter_list = $(
                            "#parseNovelAndChapters .chapter-list"
                        );
                        chapter_list.html("");
                        sourceNovel.chapters?.forEach((chapter) => {
                            chapter_list.append(`
                    <div class="chapter-item">
                        <samp class="info-value btn-light">${chapter.name?.slice(
                            0,
                            26
                        )}</samp><br>
                        <samp class="info-value btn-light">${
                            chapter.releaseTime
                        }</samp>
                        <div class="info-copy btn btn-primary" data="${
                            chapter.url
                        }" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy url</div>
                    </div>
                    `);
                        });
                    }
                    $("#parseNovelAndChapters .spinner-border").hide();
                }
            );
    };

    parseChapter = () => {
        const chapterUrl = $("#parseChapter input").val();
        $("#parseChapter .spinner-border").show();
        fetch(`/parseChapter/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pluginRequirePath: this.requirePath,
                chapterUrl: chapterUrl,
            }),
        })
            .then((res) => res.json())
            .then((chapterText) => {
                $("#parseChapter textarea").text(chapterText);
                $("#parseChapter .spinner-border").hide();
            });
    };

    fetchImage = () => {
        const url = $("#fetchImage input").val();
        $("#fetchImage .spinner-border").show();
        fetch(`/fetchImage/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pluginRequirePath: this.requirePath,
                url: url,
            }),
        })
            .then((res) => res.json())
            .then((base64) => {
                $("#fetchImage img").attr(
                    "src",
                    `data:image/jpg;base64,${base64}`
                );
                $("#fetchImage .spinner-border").hide();
            });
    };
}

$(".popularNovels-btn").on("click", () =>
    state.current_plugin?.popularNovels()
);

$(".searchNovels-btn").on("click", () => state.current_plugin?.searchNovels());

$(".parseNovelAndChapters-btn").on("click", () =>
    state.current_plugin?.parseNovelAndChapters()
);

$(".parseChapter-btn").on("click", () => state.current_plugin?.parseChapter());
$(".fetchImage-btn").on("click", () => state.current_plugin?.fetchImage());

// JQuery document.body.onload
$(() => {
    state.plugin_search.keyword = plugin_search[0].value;
});
