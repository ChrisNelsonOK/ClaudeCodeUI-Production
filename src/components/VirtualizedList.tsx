import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (props: { index: number; style: React.CSSProperties; data: T[] }) => React.ReactElement;
  overscan?: number;
  className?: string;
}

function VirtualizedList<T>({ 
  items, 
  itemHeight, 
  renderItem, 
  overscan = 5,
  className = '' 
}: VirtualizedListProps<T>) {
  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 text-gray-400 ${className}`}>
        <p>No items to display</p>
      </div>
    );
  }

  return (
    <div className={`h-full ${className}`}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            itemData={items}
            overscanCount={overscan}
            width={width}
          >
            {renderItem}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}

export default VirtualizedList;