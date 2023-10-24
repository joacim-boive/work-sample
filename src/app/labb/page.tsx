import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';

const LabbPage: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction history</CardTitle>
        <CardDescription>
          Lists transactions in descending order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid">Col 1</div>
          <div className="grid">
            <div className="relative h-20 overflow-auto m-10 border-2 border-gray-300 rounded-md w-1/3">
              <table>
                <thead>
                  <tr>
                    <th className="sticky top-0 bg-slate-50">HEAD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>5</td>
                  </tr>
                  <tr>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>7</td>
                  </tr>
                  <tr>
                    <td>8</td>
                  </tr>
                  <tr>
                    <td>9</td>
                  </tr>
                  <tr>
                    <td>10</td>
                  </tr>
                </tbody>
              </table>
              <button type="button">Button</button>d
            </div>
            <Link href="/">Home</Link>
            <h1>BOTTOM</h1>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabbPage;
