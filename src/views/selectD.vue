<template>
<ul v-selectable>
    <li>
        item1
    </li>
    <li>
        item2
    </li>
    <li>
        item3
    </li>
    <li>
        item4
    </li>
    <li>
        item5
    </li>
</ul>
</template>

<script>
export default {

}
</script>

<style>
ul {

    margin: 40px 40px 40px 40px;

    border: 1px solid red;

    width: 300px;

    padding-bottom: 20px;

}

ul li {

    width: 200px;

    height: 30px;

    list-style: none;

    border: 1px solid black;

    margin-left: 10px;

    margin-top: 30px;

    text-align: center;

    line-height: 30px;

    user-select: none;

}

ul li.active {

    background-color: red;

}
</style>
