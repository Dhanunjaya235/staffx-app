import React from 'react';

export type CardAction = {
	key: string;
	label: string;
	iconName?: string;
};

export type ValueRenderer<T> = (value: unknown, item: T) => React.ReactNode;

export type FieldConfig<T> = {
	key: keyof T | string; // dot-path supported
	label?: string;
	render?: ValueRenderer<T>;
	numberOfLines?: number; // default 1
	hidden?: (item: T) => boolean;
};

export type Extractors<T> = {
	getId: (item: T) => string;
	getTitle: (item: T) => string;
	getSubtitle?: (item: T) => string | undefined;
	getAvatarText?: (item: T) => string | undefined;
	getAvatarUrl?: (item: T) => string | undefined | null;
	getMetaPill?: (
		item: T
	) => { text: string; tone?: 'success' | 'warning' | 'info' | 'neutral' | 'danger' } | undefined;
};

export type CardProps<T> = {
	item: T;
	extractors: Extractors<T>;
	fields?: FieldConfig<T>[];
	actions?: CardAction[];
	onPress?: (item: T) => void;
	onActionPress?: (action: CardAction, item: T) => void;
	className?: string;
	testID?: string;
};

export type CardListProps<T> = {
	data: T[];
	extractors: Extractors<T>;
	fields?: FieldConfig<T>[];
	actions?: CardAction[];
	onItemPress?: (item: T) => void;
	onActionPress?: (action: CardAction, item: T) => void;
	keyExtractor?: (item: T) => string; // default extractors.getId
	contentPadding?: number; // default 16
	itemGap?: number; // default 12
	ListEmptyComponent?: React.ComponentType | React.ReactElement | null;
	ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
	ListFooterComponent?: React.ComponentType | React.ReactElement | null;
	refreshing?: boolean;
	onRefresh?: () => void;
	testID?: string;
};

export type MetaTone = 'success' | 'warning' | 'info' | 'neutral' | 'danger';



