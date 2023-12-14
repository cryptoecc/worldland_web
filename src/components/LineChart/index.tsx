import styled from "styled-components"
import { XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import Card from 'components/Card'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { darken } from 'polished'
import useTheme from 'hooks/useTheme'
dayjs.extend(utc)

const DEFAULT_HEIGHT = 300

const Wrapper = styled(Card)`
  width: 50%;
  height: ${DEFAULT_HEIGHT}px;
  padding: 1rem;
  padding-right: 2rem;
  display: flex;
  background-color: ${({ theme }) => theme.bg0};
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
`

const Chart = () => {
    const theme = useTheme()
    const data = [
        { name: 'Page A', uv: 200, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 240, pv: 2400, amt: 2400 },
        { name: 'Page C', uv: 280, pv: 2400, amt: 2400 },
        { name: 'Page D', uv: 230, pv: 2400, amt: 2400 },
        { name: 'Page E', uv: 330, pv: 2400, amt: 2400 },
        { name: 'Page C', uv: 280, pv: 2400, amt: 2400 },
        { name: 'Page D', uv: 230, pv: 2400, amt: 2400 },
        { name: 'Page E', uv: 330, pv: 2400, amt: 2400 },
        { name: 'Page C', uv: 280, pv: 2400, amt: 2400 },
        { name: 'Page D', uv: 230, pv: 2400, amt: 2400 },
        { name: 'Page E', uv: 330, pv: 2400, amt: 2400 },
        { name: 'Page E', uv: 330, pv: 2400, amt: 2400 },
        { name: 'Page E', uv: 330, pv: 2400, amt: 2400 },
        { name: 'Page E', uv: 330, pv: 2400, amt: 2400 },
        { name: 'Page E', uv: 330, pv: 2400, amt: 2400 },
    ];
    const color = "#b25656";
    return (
        <Wrapper>
            <AreaChart width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}>
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={darken(0.36, color)} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(time) => dayjs().format('DD')}
                    minTickGap={10}
                />
                <Tooltip
                    cursor={{ stroke: theme?.bg2 }}
                    contentStyle={{ display: 'none' }}
                />
                <Area dataKey="uv" type="monotone" stroke={color} fill="url(#gradient)" strokeWidth={2} />
            </AreaChart>
        </Wrapper>
    )
}

export default Chart