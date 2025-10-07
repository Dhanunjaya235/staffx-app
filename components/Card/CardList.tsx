import React, { memo, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { Card } from './Card';
import type { CardListProps } from '../../types/card';

function BaseCardListComponent<T>({
	data,
	extractors,
	fields,
	actions,
	onItemPress,
	onActionPress,
	keyExtractor,
	contentPadding = 16,
	itemGap = 12,
	ListEmptyComponent,
	ListHeaderComponent,
	ListFooterComponent,
	refreshing,
	onRefresh,
	testID,
}: CardListProps<T>) {
	const getKey = useCallback(
		(item: T) => (keyExtractor ? keyExtractor(item) : extractors.getId(item)),
		[keyExtractor, extractors]
	);

	const renderItem = useCallback(
		({ item }: { item: T }) => (
			<Card<T>
				item={item}
				extractors={extractors}
				fields={fields}
				actions={actions}
				onPress={onItemPress}
				onActionPress={onActionPress}
			/>
		),
		[extractors, fields, actions, onItemPress, onActionPress]
	);

	return (
		<FlatList
			data={data}
			keyExtractor={(item) => getKey(item)}
			renderItem={renderItem}
			contentContainerStyle={{ padding: contentPadding }}
			ItemSeparatorComponent={() => <View style={{ height: itemGap }} />}
			ListEmptyComponent={ListEmptyComponent as any}
			ListHeaderComponent={ListHeaderComponent as any}
			ListFooterComponent={ListFooterComponent as any}
			refreshing={refreshing}
			onRefresh={onRefresh}
			testID={testID || 'card-list'}
			removeClippedSubviews
			initialNumToRender={10}
			windowSize={10}
		/>
	);
}

export const CardList = memo(BaseCardListComponent) as typeof BaseCardListComponent;

export default CardList;



