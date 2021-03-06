# Lask

Lask is a NodeJS app designed to take a string of text containing information about Monster Hunter skills, weapons, and damage information, then outputs a final damage value.

## Examples

```
>>> 100 raw, 0 aff, 15 hz, we, cb, AUL, 1.5x raw
<<< Effective damage: 27

>>> 320 raw, 40 aff, 15 hz, we
<<< Effective damage: 52

>>> mhgu bow: 220 raw, 40 aff, 60 hz, 1.5x raw, we, cb, 0.22 mv, 0.80 gdm
<<< Effective damage: 47
```

As most Monster Hunter damage calculation components are multipliers, Lask supports generic raw multipliers (`1.1x raw`) and addition/subtraction (`+22 raw`), therefore if Lask does not currently support a MH skill or damage calculation mechanic innately, it will manage if the skill or mechanic is converted into a damage multiplier.

## Dependencies

Lask requires the following:

```
nearley
standard
```

## Documentation

### Writing input

Lask functions on MH shorthand. Give Lask a comma-space (`, `) separated string for parsing. For example:

* `320 raw, 40 aff, 15 hz, we` means a MH weapon with 320 base raw, 40 affinity, connecting on a 15 hitzone with WE (Weakness Exploit) as an armor skill.


### Keywords

Lask parses for the following keywords:

#### Standard

keyword                  | effect
------------             | -------------
`${number} hz`           | Sets raw hitzone of monster part being hit
`${number} raw`          | Set weapon raw. Adding/subtracting raw can be indicated with `+${number} raw` or `-{number} raw`. Raw multipliers can be indicated with `${number}x raw
`${number} aff`          | Set weapon affinity. Adding/subtracting affinity can be indicated with `+${number} aff` or `-{number} aff`