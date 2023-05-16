// Load Choices
function loadChoices() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js';
        script.onload = () => {
            resolve();
        };
        document.head.appendChild(script);
    });
}

function loadChoicesCSS() {
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.href = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css';
        link.rel = 'stylesheet';
        link.onload = () => {
            resolve();
        };
        document.head.appendChild(link);
    });
}

function extractYear(date) {
    const yearPattern = /\b(\d{4})\b/;
    const year = date.match(yearPattern);
    return year[0];
}

function cleanIntervieweeName(interviewee) {
    return interviewee
        .replace(/\[\[(.*?)\]\]/g, '$1') // remove wikitext markup [[...]]
        .replace(/\{\{W\|(.*?)\|(.*?)\}\}/g, '$2') // remove wikitext markup with piped link {{W|...|...}}
        .replace(/\{\{W\|(.*?)\}\}/g, '$1') // remove wikitext markup {{W|...}}
        .replace(/\[extlink (.*?)\]/g, '$1'); // remove markup [extlink ...]
}

function generateHTML(dates, interviewees, types, statuses, publications, tags) {
    // Date filter
    const filterContainer = document.getElementById('date-filter-container');
    const dateRangeFilter = document.createElement('select');
    dateRangeFilter.classList.add('date-filter-select');
    dateRangeFilter.addEventListener("change", filterInterviews);

    const defaultDate = document.createElement('option');
    defaultDate.value = '';
    defaultDate.textContent = 'All Dates';
    dateRangeFilter.appendChild(defaultDate);

    dates.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        dateRangeFilter.appendChild(option);
    });

    filterContainer.appendChild(dateRangeFilter);

    const dateChoices = new Choices('.date-filter-select', {
        allowHTML: false,
        searchPlaceholderValue: 'Search for a year...',
        position: 'bottom',
        fuseOptions: {
            threshold: 0.02
        },
        itemSelectText: ''
    });

    // Interviewee filter
    const intervieweeFilterContainer = document.getElementById('interviewee-filter-container');
    const intervieweeFilter = document.createElement('select');
    intervieweeFilter.classList.add('interviewee-filter-select');
    intervieweeFilter.addEventListener("change", filterInterviews);

    const intervieweeOption = document.createElement('option');
    intervieweeOption.value = '';
    intervieweeOption.textContent = 'All People';
    intervieweeFilter.appendChild(intervieweeOption);

    interviewees.forEach(interviewee => {
        const option = document.createElement('option');
        option.value = interviewee;
        option.textContent = interviewee;
        intervieweeFilter.appendChild(option);
    });

    intervieweeFilterContainer.appendChild(intervieweeFilter);

    const intervieweeChoices = new Choices('.interviewee-filter-select', {
        allowHTML: false,
        position: 'bottom',
        searchPlaceholderValue: 'Search for a name...',
        fuseOptions: {
            threshold: 0.1
        },
        itemSelectText: '',
        shouldSort: false
    });

    // Type filter
    const typeFilterContainer = document.getElementById('type-filter-container');
    const typeFilter = document.createElement('select');
    typeFilter.classList.add('type-filter-select');
    typeFilter.addEventListener("change", filterInterviews);

    const typeOption = document.createElement('option');
    typeOption.value = '';
    typeOption.textContent = 'All Types';
    typeFilter.appendChild(typeOption);

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });

    typeFilterContainer.appendChild(typeFilter);

    const typeChoices = new Choices('.type-filter-select', {
        allowHTML: false,
        position: 'bottom',
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false
    });

    // Status filter
    const statusFilterContainer = document.getElementById('status-filter-container');
    const statusFilter = document.createElement('select');
    statusFilter.classList.add('status-filter-select');
    statusFilter.addEventListener("change", filterInterviews);

    const statusOption = document.createElement('option');
    statusOption.value = '';
    statusOption.textContent = 'All Statuses';
    statusFilter.appendChild(statusOption);

    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusFilter.appendChild(option);
    });

    statusFilterContainer.appendChild(statusFilter);

    const statusChoices = new Choices('.status-filter-select', {
        allowHTML: false,
        position: 'bottom',
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false
    });

    // Publication filter
    const publicationFilterContainer = document.getElementById('publication-filter-container');
    const publicationFilter = document.createElement('select');
    publicationFilter.classList.add('publication-filter-select');
    publicationFilter.addEventListener("change", filterInterviews);

    const publicationOption = document.createElement('option');
    publicationOption.value = '';
    publicationOption.textContent = 'All Publications';
    publicationFilter.appendChild(publicationOption);

    publications.forEach(publication => {
        const option = document.createElement('option');
        option.value = publication;
        option.textContent = publication;
        publicationFilter.appendChild(option);
    });

    publicationFilterContainer.appendChild(publicationFilter);

    const publicationChoices = new Choices('.publication-filter-select', {
        allowHTML: false,
        position: 'bottom',
        searchPlaceholderValue: 'Search for a publication...',
        fuseOptions: {
            threshold: 0.1
        },
        itemSelectText: '',
        shouldSort: false
    });

    // Tag filter
    const tagFilterContainer = document.getElementById('tag-filter-container');
    const tagFilter = document.createElement('select');
    tagFilter.classList.add('tag-filter-select');
    tagFilter.multiple = true;  // Enable multiple selection
    tagFilter.addEventListener("change", filterInterviews);

    const tagOption = document.createElement('option');
    tagOption.value = '';
    tagOption.textContent = 'Filter by tag...';
    tagFilter.appendChild(tagOption);

    const tagOrder = ['Manga', 'Anime', 'OVA', 'Film', 'TV Drama', 'Video Game', 'Novel', 'Music', 'Part 1', 'Part 2', 'Part 3', 'Part 4', 'Part 5', 'Part 6', 'Part 7', 'Part 8', 'Part 9', 'Thus Spoke Kishibe Rohan', 'Cool Shock B.T.', 'Baoh the Visitor', 'Miscellaneous'];
    tags.sort((a, b) => {
        const indexA = tagOrder.indexOf(a);
        const indexB = tagOrder.indexOf(b);

        // If a tag is not found in the array, sort it to the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
    });

    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });

    tagFilterContainer.appendChild(tagFilter);

    const tagChoices = new Choices('.tag-filter-select', {
        removeItemButton: true, // To make it easier for users to remove tags
        maxItemCount: -1, // No limit on the number of tags users can select
        allowHTML: false,
        position: 'bottom',
        fuseOptions: {
            threshold: 0.1
        },
        itemSelectText: '',
        shouldSort: false,
        searchResultLimit: 9
    });

    // Reset
    document.getElementById('reset-button').addEventListener('click', () => {
        dateChoices.setChoiceByValue('');
        intervieweeChoices.setChoiceByValue('');
        typeChoices.setChoiceByValue('');
        statusChoices.setChoiceByValue('');
        publicationChoices.setChoiceByValue('');
        tagChoices.removeActiveItems();
        filterInterviews();
    });

    // Search
    const form = document.getElementById('interview-search');
    const searchResultsDiv = document.getElementById('search-results');
    const interviewContainer = document.getElementById('interview-container');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchQuery = form.querySelector('input[name="search"]').value;

        if (searchQuery !== '') {
            fetch(`/api.php?action=query&list=search&format=json&srsearch=${searchQuery}&srnamespace=7000&utf8=1&formatversion=2`)
                .then(response => response.json())
                .then(data => {
                    const searchResults = data.query.search;

                    searchResultsDiv.innerHTML = '';
                    if (searchResults.length > 0) {
                        interviewContainer.style.display = 'none';
                        searchResultsDiv.innerHTML += '<p><b>Note:</b> This does not return every interview with a matching query, only the top 10 closest matches.</p>';
                        searchResults.forEach(function (result) {
                            const resultTitle = result.title;
                            const resultSnippet = result.snippet;
                            const cleanedResultTitle = resultTitle.replace('Interview:', '');
                            const pageURL = `https://jojowiki.com/${encodeURIComponent(resultTitle.replace(' ', '_'))}`;
                            searchResultsDiv.innerHTML +=
                                '<div class="search-result">' +
                                '<h3><a href="' + pageURL + '">' + cleanedResultTitle + '</a></h3>' +
                                '<p><b>Excerpt: </b>' + resultSnippet + '...</p>' +
                                '</div>';
                        });
                        updateInterviewCount();
                    } else {
                        searchResultsDiv.innerHTML = '<div id="no-results">I refuse.<br /><span id="no-results2">(In other words, there\'s no results. Change your query and try again)</span></div>';
                    }
                });
        }
        else {
            searchResultsDiv.innerHTML = '';
            interviewContainer.style.display = 'block';
        }
    });

    // Search Clear
    document.getElementById('search-clear-btn').addEventListener('click', () => {
        form.querySelector('input[name="search"]').value = '';
        searchResultsDiv.innerHTML = '';
        interviewContainer.style.display = 'block';
        filterInterviews();
    });

    // Hide the loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }

}

function clearSearchResults() {
    const form = document.getElementById('interview-search');
    const searchResultsDiv = document.getElementById('search-results');
    const interviewContainer = document.getElementById('interview-container');
    form.querySelector('input[name="search"]').value = '';
    searchResultsDiv.innerHTML = '';
    interviewContainer.style.display = 'block';
}

function updateInterviewCount() {
    const interviewContainer = document.getElementById('interview-container');
    const searchResultsDiv = document.getElementById('search-results');
    const allInterviews = document.querySelectorAll('.interview');
    const totalInterviews = allInterviews.length;

    if (searchResultsDiv.innerHTML == '' && interviewContainer.style.display !== 'none') {
        const visibleInterviews = Array.from(allInterviews).filter(interview => interview.style.display !== 'none').length;
        const interviewCountDiv = document.getElementById('interviewCount');
        interviewCountDiv.style.display = 'block';
        interviewCountDiv.textContent = `Showing ${visibleInterviews} of ${totalInterviews}`;
    }
    else {
        const resultInterviews = document.querySelectorAll('.search-result').length;
        const interviewCountDiv = document.getElementById('interviewCount');
        interviewCountDiv.style.display = 'block';
        interviewCountDiv.textContent = `Showing ${resultInterviews} of ${totalInterviews}`;
    }
}

function filterInterviews() {
    const dateFilter = document.querySelector('.date-filter-select');
    const selectedDate = dateFilter.value;
    const intervieweeFilter = document.querySelector('.interviewee-filter-select');
    const selectedInterviewee = cleanIntervieweeName(intervieweeFilter.value);
    const typeFilter = document.querySelector('.type-filter-select');
    const selectedType = typeFilter.value;
    const statusFilter = document.querySelector('.status-filter-select');
    const selectedStatus = statusFilter.value;
    const publicationFilter = document.querySelector('.publication-filter-select');
    const selectedPublication = publicationFilter.value;
    const tagFilter = document.querySelector('.tag-filter-select');
    const selectedTags = Array.from(tagFilter.selectedOptions).map(option => option.value);  // Get all selected tags

    const statusMapping = {
        'Translated': 'Complete',
        'Incomplete Translation': 'Incomplete',
        'Missing Translation': 'Missing',
        'Transcript Available': 'Complete',
        'Incomplete Transcript': 'Incomplete',
        'Missing Transcript': 'Missing'
    };

    // First, make all interviews visible
    const allInterviews = document.querySelectorAll('.interview');
    allInterviews.forEach(interview => {
        interview.style.display = '';
    });

    // Then apply the filters
    allInterviews.forEach(interview => {
        const year = interview.dataset.year;
        const interviewees = JSON.parse(interview.dataset.interviewee).map(cleanIntervieweeName);
        const tlStatus = interview.dataset.tlstatus;
        const trStatus = interview.dataset.trstatus;
        const publication = interview.dataset.publication;
        let isDisplay = true;

        // Date
        if (selectedDate !== '') {
            if (selectedDate !== year) {
                isDisplay = false;
            }
        }

        // Interviewee
        if (selectedInterviewee !== '' && !interviewees.includes(selectedInterviewee)) {
            isDisplay = false;
        }

        // Type
        if (selectedType !== '' && interview.dataset.type !== selectedType) {
            if (interview.dataset.type !== "Interviews and Commentary")
                isDisplay = false;
        }

        // Status
        if (selectedStatus !== '') {
            const targetStatus = statusMapping[selectedStatus];

            if (selectedStatus === 'Translated' || selectedStatus === 'Incomplete Translation' || selectedStatus === 'Missing Translation') {
                if (tlStatus !== targetStatus) {
                    isDisplay = false;
                }
            } else { // if it's one of 'Transcript Available', 'Incomplete Transcript', 'Missing Transcript'
                if (trStatus !== targetStatus) {
                    isDisplay = false;
                }
            }
        }

        // Publication
        if (selectedPublication !== '' && publication !== selectedPublication) {
            isDisplay = false;
        }

        // Tags
        // Parse the tags from JSON, then trim any spaces
        const tags = JSON.parse(interview.dataset.tags).map(tag => tag.trim());

        // Check if all selected tags are included in the interview's tags
        if (selectedTags.length > 0 && !selectedTags.every(tag => tags.includes(tag))) {
            isDisplay = false;
        }
        interview.style.display = isDisplay ? '' : 'none';

        clearSearchResults();
    });

    // Update the interview count
    updateInterviewCount();

    // After applying the filters:
    const noResultsMessage = document.getElementById('no-results');
    const visibleInterviews = Array.from(allInterviews).some(interview => interview.style.display !== 'none');
    noResultsMessage.style.display = visibleInterviews ? 'none' : '';
}

async function initFilterInterviews() {
    try {
        const response = await fetch('https://jojowiki.com/JoJo_Wiki:Interviews?action=raw');
        const jsonData = await response.json();
        const interviews = jsonData.interviews;

        // Extract unique dates
        const dateSet = new Set();
        interviews.forEach(interview => {
            dateSet.add(extractYear(interview.date));
        });
        const dates = [...dateSet];

        // Extract unique interviewees and count their appearances
        const intervieweesObj = {};
        interviews.forEach(interview => {
            const interviewees = interview.interviewee;
            interviewees.forEach(interviewee => {
                const cleanName = cleanIntervieweeName(interviewee);
                if (intervieweesObj[cleanName]) {
                    intervieweesObj[cleanName] += 1;
                } else {
                    intervieweesObj[cleanName] = 1;
                }
            });
        });

        // Convert the interviewees object to an array and sort it by the frequency
        const interviewees = Object.entries(intervieweesObj)
            .sort((a, b) => b[1] - a[1]) // sort by the frequency, in descending order
            .map(item => item[0]); // get only the names

        // Types
        const types = ['Interview', 'Commentary'];

        // Status
        const statuses = ['Translated', 'Incomplete Translation', 'Missing Translation', 'Transcript Available', 'Incomplete Transcript', 'Missing Transcript'];

        // Extract unique publications
        const publicationSet = new Set();
        interviews.forEach(interview => {
            if (interview.publication) { // This check will ensure that null or undefined values are not added to the set
                publicationSet.add(interview.publication);
            }
        });
        const publications = [...publicationSet];

        // Extract unique tags
        const tagSet = new Set();

        interviews.forEach(interview => {
            const tags = interview.tags;
            tags.forEach(tag => {
                tagSet.add(tag);
            });
        });
        const tags = [...tagSet];

        return {
            dates,
            interviewees,
            types,
            statuses,
            publications,
            tags
        };
    } catch (error) {
        console.error('Error during initFilterInterviews:', error);
    }
}

async function main() {
    try {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        await loadChoices();
        await loadChoicesCSS();

        const { dates, interviewees, types, statuses, publications, tags } = await initFilterInterviews();

        generateHTML(dates, interviewees, types, statuses, publications, tags);

        const resetButton = document.getElementById('reset-button');
        resetButton.style.display = 'block';

        const searchForm = document.getElementById('interview-search');
        searchForm.style.display = 'block';

        // Update the interview count
        updateInterviewCount();
    } catch (error) {
        console.error('Error during main:', error);
    }
}

main();