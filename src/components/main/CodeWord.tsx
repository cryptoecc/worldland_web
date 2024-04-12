import { useCodeWord } from 'hooks/useCodeWord';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { theme } from 'style/theme';
import { ChartContainer, DetailDescription } from './CodeWord.style';

const MainCodeWord = () => {
  const { codeWord } = useCodeWord();

  return (
    <ChartContainer>
      <DetailDescription>The number of nodes is 10^y</DetailDescription>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={codeWord}>
          <XAxis dataKey="date" tick={{ fontSize: 14 }} tickFormatter={(value) => `${value}일`} />
          <YAxis dataKey="data" tick={{ fontSize: 14 }} tickFormatter={(value) => `${value}`} domain={[0, 6]} />
          <CartesianGrid stroke="none" />
          <Tooltip />
          <Legend />
          <defs>
            <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.colors.white} />
              <stop offset="100%" stopColor={theme.colors.black} />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="data"
            stroke="silver" // 파란색으로 변경
            strokeWidth={3.5}
            dot={false}
            activeDot={{ stroke: 'black', r: 4 }}
            fillOpacity={0}
          />
        </LineChart>
      </ResponsiveContainer>
      <br />
      <br />

      <DetailDescription>
        {/* Active Nodes : Node Counts that have successfully mined more than once on the Worldland Network in 2 Month. */}
        {/* CodeWord : Validated solution to the cryptopuzzle for this block. */}
      </DetailDescription>
      <br />
    </ChartContainer>
  );
};

export default MainCodeWord;
