console.log('-- hope-coursename-fix --')

function getCourseRecord () {
    const linkPageUrl = 'https://hope.fun.ac.jp/mod/page/view.php?id=70596'
    const courseSelector = 'div>ul>li>a[href*="https://hope.fun.ac.jp/course/view.php?id="]'

    return new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe')
        iframe.style = 'none'
        iframe.src = linkPageUrl
        iframe.addEventListener('load', () => {
            const record = {}
            const anchors = Array.from(iframe.contentWindow.document.querySelectorAll(courseSelector))
            for (const { href, innerHTML } of anchors) {
                const [_, id] = href.split('=')
                const name = innerHTML.trim()
                record[id] = name
                record[name] = id
            }
            document.body.removeChild(iframe)
            resolve(record)
        })
        document.body.appendChild(iframe)
    })
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

