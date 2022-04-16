console.log('-- hope-coursename-fix --')

function getCourseRecord () {
    const listPath = 'course-list.json'
    const courseListUrl = chrome.runtime.getURL(listPath)
    return fetch(courseListUrl).then(res => res.json())
}

void (async function main () {
    const courseRecord = await getCourseRecord()

    const badCourseNamePattern = /^\d{4}\-.+/
    const selector = 'a[href*="https://hope.fun.ac.jp/course/view.php?id="]'
    const anchors = [...document.querySelectorAll(selector)]

    for (const a of anchors) {
        const [_, id] = a.href.split('=')
        const targets = Array.from(a.querySelectorAll('* *'))
            .filter(e => e.innerHTML.match(badCourseNamePattern))

        if (a.children.length === 0) {
            a.innerHTML = courseRecord[id] || a.innerHTML
        }
        for (const target of targets) {
            target.innerHTML = courseRecord[id] || target.innerHTML
        }
    }
})()

