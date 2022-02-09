const ora = require('ora');
const chalk = require('chalk');
const puppeteer = require('puppeteer');
if (!process.argv[2]) {
    console.log(chalk.red('请输入参数!!!'));
} else {
    var spinner = ora();
    spinner.start();
    (async function () {
        const bs = await puppeteer.launch({ headless: true });
        const pg = await bs.newPage();
        // await pg.goto(`http://dict.youdao.com/suggest?type=DESKDICT&num=1&q=${process.argv[2]}&ver=2.0&le=eng`)
        await pg.goto(
            `http://dict.youdao.com/w/eng/${process.argv[2]}/#keyfrom=dict2.index`
        );
        const result = await pg.evaluate(() => {
            var pronounce = Array.from(
                document.querySelectorAll('.pronounce')
            ).reduce((pre, item) => {
                console.log(item.innerText);
                return (pre += item.innerText);
            }, '');
            var detail = Array.from(
                document.querySelectorAll('#phrsListTab .trans-container ul li')
            ).reduce((pre, item) => {
                console.log(item.innerText);
                return (pre += item.innerText);
            }, '');
            var detailChain = Array.from(
                document.querySelectorAll(
                    '#phrsListTab .trans-container .wordGroup'
                )
            ).reduce((pre, item) => {
                console.log(item.innerText);
                return (pre += item.innerText);
            }, '');
            console.log();
            if (pronounce + detail + detailChain === '') {
                return '暂无找到任何信息';
            }
            return pronounce + detail + detailChain;
        });
        spinner.succeed(chalk.green(result));
        bs.close();
    })();
}
