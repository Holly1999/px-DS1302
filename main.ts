//% color="#6167d5" weight=10 icon="\uf017" block="DS1302"
namespace DS1302 {
    let DS1302_REG_SECOND = 0x80
    let DS1302_REG_MINUTE = 0x82
    let DS1302_REG_HOUR = 0x84
    let DS1302_REG_DAY = 0x86
    let DS1302_REG_MONTH = 0x88
    let DS1302_REG_WEEKDAY = 0x8A
    let DS1302_REG_YEAR = 0x8C
    let DS1302_REG_WP = 0x8E
    let DS1302_REG_CTRL = 0x90
    let DS1302_REG_RAM = 0xC0

    function HexToDec(dat: number): number {
        return (dat >> 4) * 10 + (dat % 16);
    }

    function DecToHex(dat: number): number {
        return Math.idiv(dat, 10) * 16 + (dat % 10)
    }

    export class ClockDS1302 {
        clk: DigitalPin;
        dio: DigitalPin;
        cs: DigitalPin;

        WriteByte(dat: number) {
            for (let i = 0; i < 8; i++) {
                pins.digitalWritePin(this.dio, (dat >> i) & 1);
                pins.digitalWritePin(this.clk, 1);
                pins.digitalWritePin(this.clk, 0);
            }
        }

        ReadByte(): number {
            let rData = 0;
            for (let i = 0; i < 8; i++) {
                rData = rData | (pins.digitalReadPin(this.dio) << i);
                pins.digitalWritePin(this.clk, 1);
                pins.digitalWritePin(this.clk, 0);
            }
            return rData;
        }

        GetReg(reg: number): number {
            let t = 0;
            pins.digitalWritePin(this.cs, 1);
            this.WriteByte(reg);
            t = this.ReadByte();
            pins.digitalWritePin(this.cs, 0);
            return t;
        }

        SetReg(reg: number, dat: number) {
            pins.digitalWritePin(this.cs, 1);
            this.WriteByte(reg);
            this.WriteByte(dat);
            pins.digitalWritePin(this.cs, 0);
        }

        wr(reg: number, dat: number) {
            this.SetReg(DS1302_REG_WP, 0)
            this.SetReg(reg, dat)
            this.SetReg(DS1302_REG_WP, 0)
        }


        //% parts="DS1302"
        //% blockId="SetYear" weight=80 blockGap=8
        //% block="%ds|Set year %dat"
        SetYear(dat: number): void {
            this.wr(DS1302_REG_YEAR, DecToHex(dat % 100))
        }

        //% parts="DS1302"
        //% blockId="SetMonth" weight=79 blockGap=8
        //% block="%ds|Set month %dat"
        //% dat.min=1 dat.max=12
        SetMonth(dat: number): void {
            this.wr(DS1302_REG_MONTH, DecToHex(dat % 13))
        }

        //% parts="DS1302"
        //% blockId="SetDay" weight=78 blockGap=8
        //% block="%ds|Set day %dat"
        //% dat.min=1 dat.max=31
        SetDay(dat: number): void {
            this.wr(DS1302_REG_DAY, DecToHex(dat % 32))
        }

        //% parts="DS1302"
        //% blockId="SetHour" weight=77 blockGap=8
        //% block="%ds|Set hour %dat"
        //% dat.min=0 dat.max=23
        SetHour(dat: number): void {
            this.wr(DS1302_REG_HOUR, DecToHex(dat % 24))
        }

        //% parts="DS1302"
        //% blockId="DS1302_set_minute" weight=76 blockGap=8
        //% block="%ds|Set minute %dat"
        //% dat.min=0 dat.max=59
        SetMinute(dat: number): void {
            this.wr(DS1302_REG_MINUTE, DecToHex(dat % 60))
        }

        //% parts="DS1302"
        //% blockId="SetSecond" weight=75 blockGap=8
        //% block="%ds|Set second %dat"
        //% dat.min=0 dat.max=59
        SetSecond(dat: number): void {
            this.wr(DS1302_REG_SECOND, DecToHex(dat % 60))
        }

        //% parts="DS1302"
        //% blockId="SetWeekday" weight=74 blockGap=8
        //% block="%ds|Set weekday %dat"
        //% dat.min=1 dat.max=7
        SetWeekday(dat: number): void {
            this.wr(DS1302_REG_WEEKDAY, DecToHex(dat % 8))
        }

        //% parts="DS1302"
        //% blockId="GetYear" weight=60 blockGap=8
        //% block="%ds|Get year"
        GetYear(): number {
            return (HexToDec(this.GetReg(DS1302_REG_YEAR + 1)) + 2000)
        }

        //% parts="DS1302"
        //% blockId="GetMonth" weight=59 blockGap=8
        //% block="%ds|Get month"
        GetMonth(): number {
            return HexToDec(this.GetReg(DS1302_REG_MONTH + 1))
        }

        //% parts="DS1302"
        //% blockId="GetDay" weight=58 blockGap=8
        //%  block="%ds|Get day"
        GetDay(): number {
            return HexToDec(this.GetReg(DS1302_REG_DAY + 1))
        }

        //% parts="DS1302"
        //% blockId="GetHour" weight=57 blockGap=8
        //% block="%ds|Get hour"
        GetHour(): number {
            return HexToDec(this.GetReg(DS1302_REG_HOUR + 1)) % 24
        }

        //% parts="DS1302"
        //% blockId="GetMinute" weight=56 blockGap=8
        //% block="%ds|Get minute"
        GetMinute(): number {
            return HexToDec(this.GetReg(DS1302_REG_MINUTE + 1)) % 60
        }

        //% parts="DS1302"
        //% blockId="GetSecond" weight=55 blockGap=8
        //% block="%ds|Get second"
        GetSecond(): number {
            return HexToDec(this.GetReg(DS1302_REG_SECOND + 1)) % 60
        }

        //% parts="DS1302"
        //% blockId="GetWeekday" weight=54 blockGap=8
        //% block="%ds|Get weekday"
        GetWeekday(): number {
            return HexToDec(this.GetReg(DS1302_REG_WEEKDAY + 1))
        }

        //% parts="DS1302"
        //% blockId="start" weight=53 blockGap=8
        //% block="%ds|Clock start"
        start() {
            let t = this.GetSecond()
            this.SetSecond(t & 0x7f)
        }

        //% parts="DS1302"
        //% blockId="pause" weight=52 blockGap=8
        //% block="%ds|Clock pause"
        pause() {
            let t = this.GetSecond()
            this.SetSecond(t | 0x80)
        }

        //% parts="DS1302"
        //% blockId="ReadRam" weight=43 blockGap=8
        //% block="%ds|Read ram %reg"
        //% reg.min=0 reg.max=30
        ReadRam(reg: number): number {
            return this.GetReg(DS1302_REG_RAM + 1 + (reg % 31) * 2)
        }

        //% parts="DS1302"
        //% blockId="WriteRam" weight=42 blockGap=8
        //% block="%ds|Write ram %reg|with %dat"        
        //% reg.min=0 reg.max=30
        WriteRam(reg: number, dat: number) {
            this.wr(DS1302_REG_RAM + (reg % 31) * 2, dat)
        }

        //% parts="DS1302"
        //% blockId="DateTime" weight=30 blockGap=8
        //% block="%ds|set Date and Time: Year %year|Month %month|Day %day|WeekDay %weekday|Hour %hour|Minute %minute|Second %second"        
        //% year.min=2000 year.max=2100
        //% month.min=1 month.max=12
        //% day.min=1 day.max=31
        //% weekday.min=1 weekday.max=7
        //% hour.min=0 hour.max=23
        //% minute.min=0 minute.max=59
        //% second.min=0 second.max=59
        DateTime(year: number, month: number, day: number, weekday: number, hour: number, minute: number, second: number): void {
            this.SetYear(year);
            this.SetMonth(month);
            this.SetDay(day);
            this.SetWeekday(weekday);
            this.SetHour(hour);
            this.SetMinute(minute);
            this.SetSecond(second);
        }
    }

    //% parts="DS1302"
    //% blockId="Create" weight=100 blockGap=8
    //% block="CLK %clk|DIO %dio|CS %cs"
    export function Create(clk: DigitalPin, dio: DigitalPin, cs: DigitalPin): ClockDS1302 {
        let ds = new ClockDS1302();
        ds.clk = clk;
        ds.dio = dio;
        ds.cs = cs;
        pins.digitalWritePin(ds.clk, 0);
        pins.digitalWritePin(ds.cs, 0);
        return ds;
    }
}
