import * as React from 'react';
import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import {
    AdaptivityProvider,
    ConfigProvider,
    AppRoot,
    SplitLayout,
    SplitCol,
    View,
    Panel,
    PanelHeader,
    Header,
    Group,
    SimpleCell,
    Button,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

// Интерфейс для валюты
interface Currency {
    id: string;
    numCode: string;
    charCode: string;
    nominal: string;
    name: string;
    value: string;
}

export const APIWork = () => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(false);

    // Функция для загрузки данных
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.allorigins.win/raw?url=https://www.cbr.ru/scripts/XML_daily.asp', {
                responseType: 'document',
            });
            const xml = response.data;
            const valutes = Array.from(xml.getElementsByTagName('Valute'));

            const parsedData: Currency[] = valutes.map((valute) => ({
                id: valute.getAttribute('ID') || '',
                numCode: valute.getElementsByTagName('NumCode')[0]?.textContent || '',
                charCode: valute.getElementsByTagName('CharCode')[0]?.textContent || '',
                nominal: valute.getElementsByTagName('Nominal')[0]?.textContent || '',
                name: valute.getElementsByTagName('Name')[0]?.textContent || '',
                value: valute.getElementsByTagName('Value')[0]?.textContent || '',
            }));

            setCurrencies(parsedData);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppRoot>
            <SplitLayout>
                <SplitCol autoSpaced>
                    <View activePanel="main">
                        <Panel id="main">
                            <PanelHeader>Курсы валют ЦБ РФ</PanelHeader>
                            <Group header={<Header size="s">Валюты</Header>}>
                                <Button onClick={fetchData} loading={loading}>
                                    Загрузить курсы
                                </Button>
                                {currencies.length === 0 ? (
                                    <SimpleCell>Нажмите кнопку, чтобы загрузить курсы валют.</SimpleCell>
                                ) : (
                                    currencies.map((currency) => (
                                        <SimpleCell key={currency.id}>
                                            <div>
                                                <strong>{currency.charCode}</strong> — {currency.name}
                                            </div>
                                            <div>Номинал: {currency.nominal}</div>
                                            <div>Курс: {currency.value} ₽</div>
                                        </SimpleCell>
                                    ))
                                )}
                            </Group>
                        </Panel>
                    </View>
                </SplitCol>
            </SplitLayout>
        </AppRoot>
    );
};


