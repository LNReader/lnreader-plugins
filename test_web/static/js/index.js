const state = {
    all_plugins: {},
    plugin_arr: [],
    current_array: [],
    current_plugin: undefined,
    filters: [],
}

const language_selection = $('#language');
const plugin_search = $('#plugin');
const search_results = $('#search-results');

fetch('/all_plugins').then(res => res.json()).then(all => {
    state.all_plugins = all;
    language_selection.html(`<option value=""></option>`);
    for(let lang in all){
        language_selection.append(`<option>${lang}</option>`);
        state.plugin_arr = state.plugin_arr.concat(all[lang]);
    }
});

const display_search = (arr) => {
    search_results.hide();
    search_results.html('');
    arr.slice(0, 15).forEach(plugin => {
        search_results.append(`
            <div style="display: flex; align-items: center;">
                <button style="display: flex; align-items: center; height: 30px; flex-shrink: 0;" data-require="${plugin.requirePath}" onclick="test_plugin(this)" type="button" class="search-item btn btn-light btn-outline-primary btn-md btn-block">
                    <img src="./icons/${plugin.icon}" style="height: 100%; object-fit: contain; margin-right: 10px;">
                    ${plugin.lang}/${plugin.name}
                </button>
            </div>
        `)
    });
    search_results.show();
}

plugin_search.focus(e => {
    if(!state.all_plugins) return;
    if(language_selection.val()){
        state.current_array = state.all_plugins[language_selection.val()];
    }else{
        state.current_array = state.plugin_arr;
    }
    display_search(state.current_array);
});

plugin_search.keyup(e => {
    display_search(state.current_array.filter(plg => plg.name.toLowerCase().includes(plugin_search.val().toLowerCase())));
});

$('#clear-search').click(e => {
    search_results.hide();
    plugin_search.val('');
    plugin_search.attr('data-require', '');
});

const test_plugin = (btn) => {
    const ele = $(btn);
    plugin_requirePath = ele.attr('data-require');
    state.current_plugin = new Plugin(plugin_requirePath);
    plugin_search.attr('data-require', plugin_requirePath);
    plugin_search.val(ele.text().split('/')[1]);
    search_results.hide();
    state.current_plugin.getfilters();
}


class Plugin {
    constructor(requirePath){
        this.requirePath = requirePath;
    }

    getfilters = () => {
        const makeSelect = (filter) => {
            const container = document.createElement('div');
            const select = document.createElement('select');
            select.classList.add('select');
            if(filter.inputType === 2 || filter.inputType === "Checkbox"){
                select.setAttribute("multiple", "");
            }else{
                select.innerHTML = `<option value=""></option>`;
            }
            select.setAttribute("key", filter.key);
            filter.values.forEach((v) => {
                const option = document.createElement('option');
                option.setAttribute("value", v.value)
                option.innerText = v.label;
                select.append(option);
            });
            container.append(select);
            const label = document.createElement('label');
            label.classList.add("form-label");
            label.classList.add("select-label");
            label.innerText = filter.label;
            container.append(label);
            const hr = document.createElement('hr');
            hr.classList.add("hr");
            container.append(hr);
            return container;
        }
        fetch("/filters", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"pluginRequirePath": this.requirePath}),
        }).then(res => res.json())
        .then(filters => {
            const filtersModal = $("#filtersModal .modal-body");
            filtersModal.html("");
            filters.forEach(filter => {
                filtersModal.append(makeSelect(filter))
            });
            state.filters.length = 0;
            document.querySelectorAll('select.select').forEach(e => {
                const key = e.getAttribute("key");
                const select = new mdb.Select(e);
                select.key = key;
                state.filters.push(select);
            })
        })
    }

    popularNovels = () => {
        const filters = {};
        state.filters.forEach(_f => {
            filters[_f.key] = _f.value;
        })
        $('#popularNovels .spinner-border').show();
        fetch(`/popularNovels/`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    "pluginRequirePath": this.requirePath,
                    "filters": filters
                }
            ),
        })
        .then(res => res.json())
        .then(novels => {
            const novel_list = $('#popularNovels .novel-list');
            novel_list.html('');
            if(novels.error){
                novel_list.html(novels.error);
            }else{
                novels.forEach(novel => {
                    novel_list.append(`
                    <div class="novel-item">
                        <img src="${novel.cover}" alt="No cover found">
                        <div class="novel-info">
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">name</div>
                                <samp class="info-value btn-light">${novel.name?.slice(0, 50)}</samp>
                                <div class="info-copy btn btn-primary" data="${novel.name}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">url</div>
                                <samp class="info-value btn-light">${novel.url?.slice(0, 50)}</samp>
                                <div class="info-copy btn btn-primary" data="${novel.url}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">cover</div>
                                <samp class="info-value btn-light">${novel.cover?.slice(0, 50)}</samp>
                                <div class="info-copy btn btn-primary" data="${novel.cover}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                        </div>
                    </div>
                    `);
                })
            }
            $('#popularNovels .spinner-border').hide();
        });
    }
    
    searchNovels = () => {
        const searchTerm = $('#searchNovels input').val();
        $('#searchNovels .spinner-border').show();  
        fetch(`/searchNovels/`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"pluginRequirePath": this.requirePath, "searchTerm": searchTerm}),
        })
        .then(res => res.json())
        .then(novels => {
            const novel_list = $('#searchNovels .novel-list');
            novel_list.html('');
            if(novels.error){
                novel_list.html(novels.error);
            }else{
                novels.forEach(novel => {
                    novel_list.append(`
                    <div class="novel-item">
                        <img src="${novel.cover}" alt="No cover found">
                        <div class="novel-info">
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">name</div>
                                <samp class="info-value btn-light">${novel.name?.slice(0, 50)}</samp>
                                <div class="info-copy btn btn-primary" data="${novel.name}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">url</div>
                                <samp class="info-value btn-light">${novel.url?.slice(0, 50)}</samp>
                                <div class="info-copy btn btn-primary" data="${novel.url}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                            <div class="info-item">
                                <div class="info-name btn btn-info disabled">cover</div>
                                <samp class="info-value btn-light">${novel.cover?.slice(0, 50)}</samp>
                                <div class="info-copy btn btn-primary" data="${novel.cover}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                            </div>
                        </div>
                    </div>
                    `);
                })
            }
            $('#searchNovels .spinner-border').hide();
        });
    }
    
    parseNovelAndChapters = () => {
        const novelUrl = $('#parseNovelAndChapters input').val();
        $('#parseNovelAndChapters .spinner-border').show();  
        fetch(`/parseNovelAndChapters/`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"pluginRequirePath": this.requirePath, "novelUrl": novelUrl}),
        })
        .then(res => res.json())
        .then(sourceNovel => {
            const novel_item = $('#parseNovelAndChapters .novel-list .novel-item');
            novel_item.html(`
                <img src="${sourceNovel.cover}" alt="No cover found">
                <div class="novel-info">
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">name</div>
                        <samp class="info-value btn-light">${sourceNovel.name?.slice(0, 50)}</samp>
                        <div class="info-copy btn btn-primary" data="${sourceNovel.name}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">url</div>
                        <samp class="info-value btn-light">${sourceNovel.url?.slice(0, 50)}</samp>
                        <div class="info-copy btn btn-primary" data="${sourceNovel.url}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">cover</div>
                        <samp class="info-value btn-light">${sourceNovel.cover?.slice(0, 50)}</samp>
                        <div class="info-copy btn btn-primary" data="${sourceNovel.cover}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">summary</div>
                        <samp class="info-value btn-light">${sourceNovel.summary?.slice(0, 50)}</samp>
                        <div class="info-copy btn btn-primary" data="${sourceNovel.summary}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">author</div>
                        <samp class="info-value btn-light">${sourceNovel.author}</samp>
                        <div class="info-copy btn btn-primary" data="${sourceNovel.author}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">artist</div>
                        <samp class="info-value btn-light">${sourceNovel.artist}</samp>
                        <div class="info-copy btn btn-primary" data="${sourceNovel.artist}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">status</div>
                        <samp class="info-value btn-light">${sourceNovel.status}</samp>
                        <div class="info-copy btn btn-primary" data="${sourceNovel.status}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                    <div class="info-item">
                        <div class="info-name btn btn-info disabled">genres</div>
                        <samp class="info-value btn-light">${sourceNovel.genres?.slice(0, 50)}</samp>
                        <div class="info-copy btn btn-primary" data="${sourceNovel.genres}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy</div>
                    </div>
                </div>
            `);
            if(sourceNovel.error){
                novel_item.html(sourceNovel.error);
            }else{
                const chapter_list = $('#parseNovelAndChapters .chapter-list');
                chapter_list.html('');
                sourceNovel.chapters.forEach(chapter => {
                    chapter_list.append(`
                    <div class="chapter-item">
                        <samp class="info-value btn-light">${chapter.name?.slice(0, 26)}</samp><br>
                        <samp class="info-value btn-light">${chapter.releaseTime}</samp>
                        <div class="info-copy btn btn-primary" data="${chapter.url}" onclick="navigator.clipboard.writeText(this.getAttribute('data'))">Copy url</div>
                    </div>
                    `);
                })
            }
            $('#parseNovelAndChapters .spinner-border').hide();
        });
    }
    
    parseChapter = () => {
        const chapterUrl = $('#parseChapter input').val();
        $('#parseChapter .spinner-border').show();  
        fetch(`/parseChapter/`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"pluginRequirePath": this.requirePath, "chapterUrl": chapterUrl}),
        })
        .then(res => res.json())
        .then(chapterText => {
            $('#parseChapter textarea').text(chapterText);
            $('#parseChapter .spinner-border').hide();  
        })
    }
    
    fetchImage = () => {
        const url = $('#fetchImage input').val();
        $('#fetchImage .spinner-border').show();  
        fetch(`/fetchImage/`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"pluginRequirePath": this.requirePath, "url": url}),
        })
        .then(res => res.json())
        .then(base64 => {
            $('#fetchImage img').attr("src", `data:image/jpg;base64,${base64}`);
            $('#fetchImage .spinner-border').hide();  
        })  
    } 
}

$(".popularNovels-btn").click(e => {
    if(state.current_plugin){
        state.current_plugin.popularNovels();
    }
});

$(".searchNovels-btn").click(e => {
    if(state.current_plugin){
        state.current_plugin.searchNovels();
    }
});

$(".parseNovelAndChapters-btn").click(e => {
    if(state.current_plugin){
        state.current_plugin.parseNovelAndChapters();
    }
});

$(".parseChapter-btn").click(e => {
    if(state.current_plugin){
        state.current_plugin.parseChapter();
    }
});
$(".fetchImage-btn").click(e => {
    if(state.current_plugin){
        state.current_plugin.fetchImage();
    }
});
