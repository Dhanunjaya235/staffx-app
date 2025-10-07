import React, { memo, useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { CardProps, FieldConfig, MetaTone } from '../../types/card';

function getValueByPath<T>(item: T, path: string | keyof T): unknown {
	if (typeof path !== 'string') return (item as any)[path as unknown as string];
	const segments = path.split('.');
	let current: any = item;
	for (const seg of segments) {
		if (current == null) return undefined;
		current = current[seg];
	}
	return current;
}

function getInitials(text?: string): string {
	if (!text) return '';
	const words = text.trim().split(/\s+/);
	const first = words[0]?.[0] || '';
	const last = words.length > 1 ? words[words.length - 1]?.[0] || '' : '';
	return (first + last).toUpperCase();
}

function toneClasses(tone: MetaTone | undefined): string {
	switch (tone) {
		case 'success':
			return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
		case 'warning':
			return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
		case 'info':
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
		case 'danger':
			return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
		case 'neutral':
		default:
			return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
	}
}

function FieldRow<T>({ item, field }: { item: T; field: FieldConfig<T> }) {
	if (field.hidden && field.hidden(item)) return null;
	const rawValue = field.render
		? undefined
		: getValueByPath(item, field.key as any);
	const rendered = field.render
		? field.render(getValueByPath(item, field.key as any), item)
		: (rawValue == null || rawValue === ''
			? '—'
			: String(rawValue));
	const numberOfLines = field.numberOfLines ?? 1;
	return (
		<View className="flex-row items-center py-2">
			{field.label ? (
				<View className="min-w-[44%] pr-3">
					<Text
						className="text-[12px] leading-5 text-neutral-500"
						numberOfLines={1}
						accessibilityLabel={`${field.label}`}
					>
						{field.label}
					</Text>
				</View>
			) : <View className="min-w-[44%] pr-3" />}
			<View className="flex-1 items-end">
				{typeof rendered === 'string' || typeof rendered === 'number' ? (
					<Text
						className="text-[13px] leading-5 text-neutral-900 font-semibold text-right"
						numberOfLines={numberOfLines}
					>
						{rendered as any}
					</Text>
				) : (
					<View className="items-end w-full">{rendered as any}</View>
				)}
			</View>
		</View>
	);
}

function Avatar({ uri, text }: { uri?: string | null; text?: string }) {
	const initials = useMemo(() => getInitials(text), [text]);
	if (uri) {
		return (
			<Image
				source={{ uri }}
				className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700"
				accessibilityIgnoresInvertColors
			/>
		);
	}
	if (initials) {
		return (
			<View className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center">
				<Text className="text-neutral-700 dark:text-neutral-200 font-semibold">{initials}</Text>
			</View>
		);
	}
	return (
		<View className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800" />
	);
}

function ActionsRow<T>({ actions, onActionPress, item }: { actions?: CardProps<T>['actions']; onActionPress?: CardProps<T>['onActionPress']; item: T }) {
	if (!actions || actions.length === 0) return null;
	return (
		<View className="flex-row justify-end items-center gap-2 mt-3">
			{actions.map(action => (
				<Pressable
					key={action.key}
					className="min-w-[44px] min-h-[44px] px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800"
					onPress={() => onActionPress && onActionPress(action, item)}
					accessibilityRole="button"
					accessibilityLabel={action.label}
					testID={`card-action-${action.key}`}
				>
					<Text className="text-sm text-neutral-800 dark:text-neutral-100">{action.label}</Text>
				</Pressable>
			))}
		</View>
	);
}

function BaseCardComponent<T>({ item, extractors, fields, actions, onPress, onActionPress, className, testID }: CardProps<T>) {
	const title = extractors.getTitle(item);
	const subtitle = extractors.getSubtitle ? extractors.getSubtitle(item) : undefined;
	const avatarUrl = extractors.getAvatarUrl ? extractors.getAvatarUrl(item) : undefined;
	const avatarText = extractors.getAvatarText ? extractors.getAvatarText(item) : undefined;
	const meta = extractors.getMetaPill ? extractors.getMetaPill(item) : undefined;

	const Container = onPress ? Pressable : View;

	const accessibilityLabel = useMemo(() => {
		const parts: string[] = [];
		if (title) parts.push(String(title));
		if (subtitle) parts.push(String(subtitle));
		if (meta?.text) parts.push(String(meta.text));
		return parts.join(', ');
	}, [title, subtitle, meta?.text]);

	return (
    <Container
            className={`rounded-xl p-4 bg-white border border-neutral-200 ${className || ''}`}
            style={styles.cardShadow}
			onPress={onPress ? () => onPress(item) : undefined}
			accessibilityLabel={accessibilityLabel}
			accessibilityRole={onPress ? 'button' : undefined}
			testID={testID || 'card-container'}
		>
			<View className="flex-row gap-3">
				<Avatar uri={avatarUrl || undefined} text={avatarText || title} />
				<View className="flex-1">
					<View className="flex-row items-start justify-between">
						<Text className="font-semibold text-base text-neutral-900 dark:text-neutral-100 flex-shrink" numberOfLines={1} testID="card-title">
							{title}
						</Text>
						{meta?.text ? (
							<View className={`px-2 py-0.5 rounded-full ${toneClasses(meta.tone)}`} testID="card-meta-pill">
								<Text className="text-xs">{meta.text}</Text>
							</View>
						) : null}
					</View>
					{subtitle ? (
						<Text className="text-neutral-500 color-red-500 dark:text-neutral-400 mt-0.5" numberOfLines={1} testID="card-subtitle">{subtitle}</Text>
					) : null}

					{fields && fields.length > 0 ? (
						<View className="mt-10" testID="card-fields">
							{fields.map((field, idx) => (
								<View
									key={(field.key as string) + '-' + idx}
									style={idx > 0 ? styles.rowDivider : undefined}
								>
									<FieldRow<T> item={item} field={field} />
								</View>
							))}
						</View>
					) : null}

					<ActionsRow<T> actions={actions} onActionPress={onActionPress} item={item} />
				</View>
			</View>
		</Container>
	);
}

export const Card = memo(BaseCardComponent) as typeof BaseCardComponent;

export default Card;

const styles = StyleSheet.create({
    cardShadow: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
    },
    rowDivider: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0,0,0,0.06)',
    },
});


