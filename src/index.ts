import express from 'express';
import ical from 'ical-generator';
import { Foto, Lunar } from 'lunar-typescript';

const app = express();
const port = 3000;

app.get('/', (_req, res) => {
    const calendar = ical({name: 'Buddha Calendar'});
    
    for(let year = 2020; year <=2030; year++){
        for(let month = 1; month<=12; month++){
            for(let day = 1; day<=31; day++){
                try {
                    const lunar = Lunar.fromYmd(year, month, day);
                    // Foto佛历
                    const foto = Foto.fromLunar(lunar);
                    // 获取所有佛教节日
                    const fotoFestival = [...foto.getFestivals(), ...foto.getOtherFestivals()];

                    for (var i = 0, j = fotoFestival.length; i < j; i++) {
                        console.log(fotoFestival[i]);
                    }

                    if(fotoFestival.length > 0) {
                        let summary = '';
                        for (let fest of fotoFestival) {
                            summary += '佛历:' + fest + '\n';
                        }
                        console.log(summary);

                        // 当有节日时，创建日历事件并添加至日历
                        calendar.createEvent({
                            start: new Date(year, month - 1, day),
                            end: new Date(year, month - 1, day, 23, 59, 59),
                            summary: summary,
                            url: 'https://www.npmjs.com/package/lunar-typescript'
                        });
                    }
                } catch(e) {
                   // 由于每月天数的限制，我们应该处理可能的错误
                   console.log("Error happens at year " + year + ", month " + month + ", day " + day, e);
                }
            }
        }
    }

    res.setHeader('Content-Type', 'text/calendar;charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="buddha_calendar.ics"');
    res.send(calendar.toString());
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
