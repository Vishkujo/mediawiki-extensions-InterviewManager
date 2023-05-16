<?php
class InterviewManagerHooks
{
    public static function onParserFirstCallInit(Parser $parser)
    {
        $parser->setHook('interview_filter', [__CLASS__, 'renderInterviewFilter']);
        return true;
    }

    public static function renderInterviewFilter($input, array $args, Parser $parser, PPFrame $frame)
    {

        global $wgScriptPath;
        $output = $parser->getOutput();
        $output->addModules(['ext.interviewManager']);

        $interviewArchive = $parser->recursiveTagParse('{{InterviewArchive}}', $frame);

        return '<div id="filter-container" class="mw-collapsible" style="background-color: #7c7c7c38; border: 3px ridge black;">
        <div id="filter-container-top" style="border-bottom: 3px ridge black; margin: -2px 0 10px;">
        <h5 id="filter-title" style="padding: 5px; font-family:Roboto;">Filter Interviews</h5>
        </div>
        <div id="loading-indicator" style="font-family: Roboto; text-align: center;"><img src="' . $wgScriptPath . '/extensions/InterviewManager/resources/Loading-Koichi.png" width="50px" height="50px" /> Loading interview filters...</div>
        <div id="filter-container-bottom" class="mw-collapsible-content" style="padding: 0 5px 15px; display: flex; flex-wrap: wrap; justify-content: center;">
        <div id="date-filter-container" class="filter-box"></div>
        <div id="interviewee-filter-container" class="filter-box"></div>
        <div id="type-filter-container" class="filter-box"></div>
        <div id="status-filter-container" class="filter-box"></div>
        <div id="publication-filter-container" class="filter-box"></div>
        <div id="tag-filter-container"></div><button class="mw-ui-button mw-ui-destructive" id="reset-button" style="display:none;">Reset Filters</button></div></div>' .
        '<form id="interview-search" action="/index.php" method="GET" style="display:none;"><input type="hidden" name="title" value="Special:Search"><input type="hidden" name="profile" value="advanced"><input type="hidden" name="fulltext" value="1"><input type="hidden" name="ns7000" value="1"><input type="text" name="search" placeholder="Search interviews..."><button id="interview-search-btn" class="mw-ui-button" type="submit">Search</button><button id="search-clear-btn" class="mw-ui-button mw-ui-destructive" type="submit">Clear Results</button></form>
        <div id="interviewCount" style="display:none;"></div>
        <div id="no-results" style="display: none;">You\'ll never reach the truth.<br /><span id="no-results2">(In other words, there\'s no results. Change the filters and try again)</span></div>
        <div id="search-results"></div>
        <div id="interview-wrapper">' . $interviewArchive . '</div>';
    }
}
