import './Header.css';

import Select from '../../shared/Select/Select';

function Header() {
    return (
        <header>
            <select id="width_tmp_select"><option id="width_tmp_option"></option></select>
            <form>
                <Select options={[
                    ['genre', 'Жанр'],
                    ['sciFi', 'Научна Фантастика'],
                    ['comedy', 'Комедия'],
                    ['horror', 'Ужаси'],
                    ['all', 'Жанр: Всички'],
                ]}/>
                <Select options={[
                    ['year', 'Година'],
                    ['2021', '2021'],
                    ['2020', '2020'],
                    ['2019', '2019'],
                    ['all', 'Година: Всички'],
                ]}/>
                <Select options={[
                    ['sort-by', 'Сортирай'],
                    ['rating', 'Рейтинг'],
                    ['views', 'Гледания'],
                    ['date-des', 'Дата →'],
                    ['date-asc', 'Дата ←'],
                    ['all', 'Сортирай: Всички'],
                ]}/>
                <Select options={[
                    ['other', 'Други настройки'],
                    ['starred', 'Любими'],
                    ['not-starred', 'Нелюбими'],
                    ['all', 'Всички'],
                ]}/>
            </form>
            <i className="fas fa-cog"></i>
        </header>
    );
}

export default Header;